const express = require('express');
const app = express()
const cors = require('cors')
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;


// middlewares
app.use(cors())
app.use(express.json())


const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
    res.send("SERVER IS RUNNING...")
})


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('loan_link');
    const userCollection = db.collection('users')

    // user apis
    app.post('/users', async(req, res) => {
        const user = req.body;
        user.createdAt = new Date();

        const query = {email: user.email};
        const existsUser = await userCollection.findOne(query);
        if(existsUser){
          return res.send({message: 'user already exists!'})
        }

        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.get('/users', async(req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
})