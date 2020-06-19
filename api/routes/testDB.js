// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// // Variable to be sent to Frontend with Database status
// let databaseConnection = "Waiting for Database response...";
// // response when a GET request is made to the homepage
// router.get("/", function(req, res, next) {
//     res.send(databaseConnection);
// });
// // Connecting to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/covid19', { useNewUrlParser: true })
// // If there is a connection error send an error message
// mongoose.connection.on("error", error => {
//     console.log("Database connection error:", error);
//     databaseConnection = "Error connecting to Database";
// });
// // If connected to MongoDB send a success message
// mongoose.connection.once("open", () => {
//     console.log("Connected to Database!");
//     databaseConnection = "Connected to Database";
// });
// module.exports = router;

const express = require("express");
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';

// Database Name
const dbName = 'covid19';


// Variable to be sent to Frontend with Database status
let databaseConnection = "Waiting for Database response...";
// response when a GET request is made to the homepage
router.get("/", function(req, res, next) {
    res.send(databaseConnection);
});


router.post("/", function(req, res){
    req.setTimeout(0)
    console.log("post content received");
    MongoClient.connect(url, { useUnifiedTopology: true }).then(function(client) {
        // assert.equal(null, err);
        db = client.db(dbName);
        collectionName = "countrydata";
        collection = db.collection(collectionName);
        //delete existing documents before repopulating collection
        collection.deleteMany({}, function(){
            // console.log(req.body.Countries);
            let data = req.body.Countries;
            collection.insertMany(data, function(err,r){
                if (err){
                    console.log("issue inserting into db: " + err);
                }

            })
        })   
    }).then(function(docs){
        docs = collection.find().toArray();
        return docs;
    }).then(function(docs){
        console.log("documents in collection "+collectionName+":")
        console.log(docs);
        console.log("huh?");
        databaseConnection = "connected to DB!";
        res.send(docs);// TODO: change endpoint URL / edit Temp to accomodate for additional res
        return docs;
    }).catch(function(err){
        console.log("error: " + err);
    });  
});

/* Queries all documents in collection [collectionName] 
from db [dbName] and returns as an array */
// let collectionName;
// MongoClient.connect(url).then(function(client) {
//     // assert.equal(null, err);
//     db = client.db(dbName);
//     collectionName = "testcollection";
//     collection = db.collection(collectionName);
//     let docs = collection.find().toArray();
//     return docs;
// }).then(function(docs){
//     console.log("documents in collection "+collectionName+":")
//     console.log(docs);
//     databaseConnection = "connected to DB!";
//     return docs;
// }).catch(function(err){
//     console.log("error: " + err);
// });  

//Connect to the server
// MongoClient.connect(url, function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");

//     const db = client.db(dbName);
//     db.collection("testcollection").insertOne({"test":"worked!"}, function(err, res){
//         if (err) throw err;
//         console.log("1 doc inserted");
//     })
//     console.log(db.collection("testcollection").find());
//     databaseConnection = "Connected to Database!"

//     var adminDb = db.admin();

//   // List all the available databases
//   adminDb.listDatabases(function(err, dbs) {
//     assert.equal(null, err);
//     if (dbs.databases.length === 0){
//         console.log("there are no databases available");
//     } else {
//         console.log(dbs.databases);
//     }


//   });

//   });




module.exports = router;


