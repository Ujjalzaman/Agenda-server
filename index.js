const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
require('dotenv').config(); 

const uri = "mongodb+srv://organicUser:RJOc223KT616G33M@cluster0.htf6k.mongodb.net/Agenda?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("Agenda").collection("Agenda");
  console.log("connected")

    app.patch('/update/:id', (req, res) => {
      serviceCollection.updateOne({_id: ObjectId(req.params.id)},{
          $set: req.body
      })
      .then(result => {
        res.send( result.modifiedCount > 0)
      })
    })



    app.post('/add', (req, res) => {
          const newBooking = req.body;
          serviceCollection.insertOne(newBooking)
              .then(result => {
                  res.send(result.insertedCount > 0);
           })
     })
  


  const handleGet = (route, collection,) => {
    app.get(route, (req, res) => {
      collection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
    })
  }
  handleGet('/agenda', serviceCollection);


  const handleDelete = (route, collection) => {
    app.delete(route, (req, res) => {
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send( result.deletedCount > 0)
      })
    })
  }
  handleDelete('/delete/:id', serviceCollection);


   const handleEdit = (route, collection) => {
    app.get(route, (req, res) => {
      collection.find({_id: ObjectId(req.params.id)})
      .toArray((err, items) => {
        res.send(items)
      })
    })
  }

  handleEdit('/edit/:id', serviceCollection, 'id');

  


});

app.get('/', (req, res) => {
	console.log("hellow workng")
	res.send('welcome to easy consulting!')
	
})

app.listen(port)

// https://learncoders.xyz/reactjs-node-js-mysql-crud-example/