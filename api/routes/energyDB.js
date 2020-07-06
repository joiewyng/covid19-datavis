const express = require("express");
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const url = require('url');
const fs = require('fs');

// Connection URL
const connectionUrl = 'mongodb://127.0.0.1:27017';

let dbName = 'energy';
let collectionName = 'renewablesrcsnetgen';

router.get("/", function(req, res){
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        console.log("weird");
        let db = client.db(dbName);
        console.log(dbName);
        console.log(collectionName);
        let collection = db.collection(collectionName);
        // pull all docs from [collectionName] collection
        let docs = collection.find().toArray();
        return docs;
    }).then(function(docs){
        res.send(docs);
        return docs;
    }).catch(function(err){
        console.log("error: " + err);
    });  
})

router.post("/donut", function(req, res){
    queryObject = url.parse(req.url,true).query;
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
        db = client.db(dbName);
        collection = db.collection(collectionName);
        if (queryObject.update){
            let data = req.body.data;
            console.log(data);
            if (data !== '' && data.length !== 0){
                let year = req.body.year;
                console.log(data);
                console.log(year);
                let update = {$set: {'Annual Totals.$':data}}
                let updatedData = collection.update({'Annual Totals.Period': {$eq: '201'+year}}, update, {upsert: true},(err) => {if (err) console.log(err)});
                return updatedData
            } 
        } else if (queryObject.reset) {
            fs.readFile("./data/net-generation-from-renewable-sources.json", function(err, data) { 
                if (err) {
                    console.log(err);
                } else {
                    let docs = JSON.parse(data); 
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
    }).catch(function(err){
        console.log("error: " + err);
    });  
})


// load json file data into MongoDB
// MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
//     db = client.db(dbName);
//     collection = db.collection(collectionName);
//     console.log(dbName);
//     console.log(collectionName);
//     let docs;
//     fs.readFile("./data/net-generation-from-renewable-sources.json", function(err, data) { 
//         if (err) {
//             console.log(err);
//         } else {
//             docs = JSON.parse(data); 
//             collection.deleteMany({}, function(){
//                 console.log("huh");
//                 collection.insertMany(docs, function(err,r){
//                     if (err){
//                         console.log("Issue inserting into DB: " + err);
//                     }
//                 })
//             })   
//         }
//     }); 
// })

module.exports = router;