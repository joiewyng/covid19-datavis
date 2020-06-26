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

router.get("/country", function(req, res){
    queryObject = url.parse(req.url,true).query;
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        db = client.db(dbName);
        collection = db.collection(collectionName);
        let countryName = queryObject.name;
        if (countryName !== ''){
            let countryData = collection.find({Country: {$eq:countryName}}).toArray();
            return countryData;
        }
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

router.post("/country", function(req, res){
    queryObject = url.parse(req.url,true).query;
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        db = client.db(dbName);
        collection = db.collection(collectionName);
        let countryName = queryObject.name;
        if (countryName !== ''){
            let data = req.body;
            // console.log('req body' + JSON.stringify(req.body));
            let update = {$set: {
                TotalDeaths : data.totalDeaths,
                TotalRecovered : data.totalRecovered,
                TotalConfirmed : data.totalConfirmed,
            }}
            // console.log('countryname: '+countryName)
            let countryData = collection.updateOne({Country: countryName}, update, err => console.log(err));
            return countryData;
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

router.post("/addcountry", function(req, res){
    queryObject = url.parse(req.url,true).query;
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        db = client.db(dbName);
        collection = db.collection(collectionName);
        let data = req.body;
        let json = {
            Country: data.Country, 
            TotalConfirmed: data.TotalConfirmed, 
            TotalDeaths: data.TotalDeaths, 
            TotalRecovered: data.TotalRecovered,
            CountryCode: '',
        };
        let insertStatus = collection.insertOne(json, err => console.log(err));
        return insertStatus;
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
