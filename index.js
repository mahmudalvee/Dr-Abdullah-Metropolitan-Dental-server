const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle-wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u47wziv.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('abdullahDental').collection('services');
        const reviewCollection = client.db('abdullahDental').collection('reviews');
        
        app.get('/homeServices', async(req, res) =>{
            const query ={}
            const cursor =serviceCollection.find(query).sort( { _id : -1 } ).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })
        
        app.get('/services', async(req, res) =>{
            const query ={}
            const cursor =serviceCollection.find(query).sort( { _id : -1 } );
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //reviews api

        app.get('/reviews', async(req, res) =>{
            let query ={};
            if(req.query.service){
                query ={
                    service: req.query.service
                }
            }
            const cursor =reviewCollection.find(query).sort( { _id : -1 } );
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/myReviews', async(req, res) =>{
            let query ={};
            if(req.query.email){
                query ={
                    email: req.query.email
                }
            }
            const cursor =reviewCollection.find(query).sort( { _id : -1 } );
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})