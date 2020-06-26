const express = require("express");
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const url = require('url');
const fs = require('fs');

// Connection URL
const connectionUrl = 'mongodb://127.0.0.1:27017';

dbName = 'covid19';
collectionName = 'countrydata';

// issue from before (expected number...): was reading from downloaded data inside the 'countrydata.json' file
router.get("/", function(req, res){
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        db = client.db(dbName);
        collection = db.collection(collectionName);
        let docs = collection.find().toArray();
        return docs
    }).then(function(docs){
        res.send(docs);
        return docs;
    }).catch(function(err){
        console.log("error: " + err);
    });  

})

module.exports = router;
