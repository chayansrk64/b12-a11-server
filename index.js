const express = require('express');
const app = express()
const cors = require('cors')
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;


// middlewares
app.use(cors())
app.use(express.json())

const verifyFireBaseToken = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if(!token){
      return res.status(401).send({message: 'unauthorized access!'})
    }

    try {
      const idToken = token.split(' ')[1]
      const decoded = await admin.auth().verifyIdToken(idToken)
      // console.log('decoded in middleware', decoded);
      req.decoded_email = decoded.email;
      next()
      
    } catch (error) {
      return res.status(401).send({message: "unauthorized access"})
    }

    
}


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
    const userCollection = db.collection('users');
    const loanApplicationCollection = db.collection('loanApplications')
    const loanCollection = db.collection('loans')


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

    app.get('/users/:email/role', async(req, res) => {
        const email = req.params.email;
        const query = {email}
        const user = await userCollection.findOne(query)
        res.send({role: user?.role || 'borrower'})
    })

    // loan apis
    app.post('/loans', async(req, res) => {
        const loan = req.body;
        const headers = req.headers;
        console.log('headers', headers);
        // console.log(loan);
        const result = await loanApplicationCollection.insertOne(loan);
        res.send(result);
    })

    app.get('/loans', async(req, res) => {
      const result = await loanCollection.find().toArray();
      res.send(result)
    })


    app.get('/loans/:id', async (req, res) => {
      const { id } = req.params;
      const loan = await loanCollection.findOne({ id }); 
      if (!loan) return res.status(404).send({ error: 'Loan not found' });
      res.send(loan);
    });


    app.get('/my-loans', async(req, res) => {
      const email = req.query.email;
      const query = email ? {applicantsEmail: email} : {}
      const result = await loanApplicationCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/pending-loans', async(req, res) => {
        const query = {status: 'pending'}
        const result = await loanApplicationCollection.find(query).toArray();
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