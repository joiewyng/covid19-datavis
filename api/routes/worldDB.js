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
        // pull all docs from 'countrydata' collection
        let docs = collection.find().toArray();
        return docs;
    }).then(function(docs){
        res.send(docs);
        return docs;
    }).catch(function(err){
        console.log("error: " + err);
    });  
})

router.get("/countrylist", function(req, res){
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        db = client.db(dbName);
        collection = db.collection(collectionName);
        // pull all docs from 'countrydata' collection
        let docs = collection.find({}, {Country:1, _id:0}).toArray();
        return docs;
    }).then(function(docs){
        res.send(docs);
        return docs;
    }).catch(function(err){
        console.log("error: " + err);
    });  
})

router.post("/", function(req, res){
    queryObject = url.parse(req.url,true).query;
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        db = client.db(dbName);
        collection = db.collection(collectionName);
        let docs;
        if (queryObject.reset){
            fs.readFile("./data/countrydatalocal.json", function(err, data) { 
                if (err) {
                    console.log(err);
                } else {
                    docs = JSON.parse(data); 
                    collection.deleteMany({}, function(){
                        collection.insertMany(docs, function(err,r){
                            if (err){
                                console.log("Issue inserting into DB: " + err);
                            }
                        })
                    })   
                }
            }); 
        }
    }).then(function(){
        updatedDocs = collection.find().toArray();
        return updatedDocs;
    }).then(function(docs){
        res.send(docs);
        return docs;
    }).catch(function(err){
        console.log("error: " + err);
    });  
})

module.exports = router;
