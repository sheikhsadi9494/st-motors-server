const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4wgcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        
        const database = client.db("st-Motors")
        const allCarsCollection = database.collection('allCars');
        const carOrdersCollection = database.collection('carsOrders');
        const reviewsCollection = database.collection('reviews');
        const usersCollection = database.collection('users');

        //Get all cars data
        app.get('/allCars', async (req, res) => {
            const query = allCarsCollection.find({});
            const result = await query.toArray();
            res.send(result);
        })
        //get single car data
        app.get('/allCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await allCarsCollection.findOne(query);
            res.send(result);
        })

        // post car data
        app.post('/allCars', async (req, res) => {
            const car = req.body;
            const reslut = await allCarsCollection.insertOne(car);
            res.json(reslut);
        })
        // delete car data
        app.delete('/allCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await allCarsCollection.deleteOne(query);
            res.json(result)
        })

        // Post carOrders data
        app.post('/carOrders', async (req, res) => {
            const carOrder = req.body;
            const result = await carOrdersCollection.insertOne(carOrder);
            res.json(result);
        })

           //get all car orders data by email
           app.get('/carOrders', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = carOrdersCollection.find(query);
            const carOrders = await cursor.toArray();
            res.json(carOrders)
        })

            //get all cars orders data
           app.get('/allCarOrders', async (req, res) => {
            const cursor = carOrdersCollection.find({});
            const carOrders = await cursor.toArray();
            res.json(carOrders)
        })

        // get all car order data by id 
        app.get('/allCarOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const reslut = await carOrdersCollection.findOne(query);
            res.send(reslut);
        })

        // delete order
        app.delete('/allCarOrders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id)};
            const result = await carOrdersCollection.deleteOne(query);
            res.json(result);
        })

           //post review data 
           app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        })

            //get all reviews data
            app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews)
        })

        // Post user data
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })

        // usert for cheack uesr 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const options = { upsert: true };
            const updateDoc = {$set: user};
            const reslut = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(reslut);
        })

        // update user as admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('PUT', user)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin'} };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // cheak user admin or not
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if( user?.role === 'admin' ){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
        })

        //update orders status
        app.put('/allCarOrders/:id', async (req, res) => {
            const id = req.params.id;
            filter = {id: id};
            console.log(filter)
            updateDoc = { $set: {status: 'shipped '} };
            const result = await carOrdersCollection.updateOne(filter, updateDoc);
            console.log(result)
            res.json('updateing');

        })


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})