const { MongoClient } = require("mongodb");

const url = "mongodb+srv://bhhuuu18:Bodya337@cluster0.mu4q4fx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "homka_db";
const collectionName = "homka's"

const client = new MongoClient(url, { tls: true, tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true });

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

app.use(express.json());

async function connectDB() {
    try {
        await client.connect();

        const db = client.db(dbName);
        const coll = db.collection(collectionName);

        return coll;
    } catch (err) {
        console.error(err);
    }

}
async function getScore(username) {
        const collection = await connectDB();

        const user = await collection.findOne({
            username: username
        });

        if(user) {
            return user.score;
        } else {
            return 404;
        }   
}

async function saveScore(username, score) {
        const collection = await connectDB();

        const el = await collection.findOne({
            username: username
        })

        if(el) {
            await collection.deleteOne({ username });
            await collection.insertOne({ username, score });
        } else {
            await collection.insertOne({ username, score })
        }
}

app.post('/saveScore', async (req, res) => {
    const { username, score } = req.body;
    try {
        console.log('Username: ', username);
        await saveScore(username, Number(score));
        res.status(201).send("State saved successfully");
    } catch (err) {
        res.status(500).send("State save error");
    }
});


app.get('/getScore', async (req, res) => {
    const username = req.query.username;
    try {
        if(username.length > 0) {
            const score = await getScore(username);
            console.log('Score: ', score);
            res.status(201).send({ score: score });
        }     
    } catch (err) {
        res.status(500).send("State get error");
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
