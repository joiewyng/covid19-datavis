const express = require("express");
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const url = require('url');
const fs = require('fs');

// Connection URL
// const connectionUrl = 'mongodb://mongo:27017';
const connectionUrl = 'mongodb://localhost:27017';

let queryObject;
let dbName, collectionName, document, documents, criteria, update, increment;
let countryData;


// Variable to be sent to Frontend with Database status
let databaseConnection = "Waiting for Database response...";

// // response when a GET request is made to the homepage
// router.get("/", function(req, res) {
//     // res.send({msg: databaseConnection});
//     res.send(countryData);
// });

// response when a GET request is made to the homepage
// router.get("/", function(req, res) {
//     queryObject = url.parse(req.url,true).query;
//     console.log('refresh get request received in Node');
//     if (queryObject.refreshchart){
//         MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client) {
//             // dbName = req.body.dbName;
//             // dbName = "test";
//             // collectionName = "countrydata";
//             db = client.db(dbName);
//             collection = db.collection(collectionName);
//             console.log('huhh');
//             docs = collection.find({Country: {$eq: "United States of America"}}).toArray();
//             res.send(docs);
//         });
//     } 
// });

router.get("/", function(req, res){
    queryObject = url.parse(req.url,true).query;
    if (queryObject.refreshchart){
        MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client){
            dbName = 'test';
            collectionName = 'countrydata';
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
        
    }
})



router.post("/", function(req, res){
    req.setTimeout(0)
    queryObject = url.parse(req.url,true).query;

    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client) {
        // ISSUE: the .thens after this one execute before the stuff in this .then finishies 
        // i.e. docs ends up being undefined

        dbName = req.body.dbName;
        db = client.db(dbName);

        // QueryObject.delete true if Delete DB button was clicked
        if (queryObject.delete){ // Delete DB
            db.dropDatabase(function(err, result){
                if (result) {
                    console.log("deleted success");
                    return Promise.resolve("deleted DB successfully!");
                } else {
                    return Promise.resolve("DB was not deleted.");
                }
            });
        } else if (queryObject.country) {

            collectionName = "countrydata";
            collection = db.collection(collectionName);
            console.log('from Node: the country is '+ queryObject.country);
            countryData = collection.find({Country: queryObject.country}).toArray(function(err, res){
                if (err) throw err;
                console.log(res);
                console.log('result: '+ res);
                // return res;
                countryData = res;
            });
            // console.log('countryData: '+countryData);
            // Promise.resolve(countryData);

        }else { // Insert Country data from public API JSON into collection "countrydata"

            collectionName = "countrydata";
            collection = db.collection(collectionName);

            // Delete existing documents before repopulating collection
            collection.deleteMany({}, function(){
                let data = req.body.json.Countries;
                collection.insertMany(data, function(err,r){
                    if (err){
                        console.log("Issue inserting into DB: " + err);
                    }
    
                })
            })   
        }
    }).then(function(docs){
        if (!queryObject.delete && !queryObject.country){
            docs = collection.find().toArray();
        }
        return docs;
    }).then(function(docs){
        if (!queryObject.delete && !queryObject.country){
            initializingDatabase = "Database has been created!";
            databaseConnection = "Connected to DB!";
        }
        // res.send(initializingDatabase);
        res.send(docs);
        return docs;
    }).catch(function(err){
        console.log("error: " + err);
    });  
});

function errCallback(err) {
    if (err) console.log(err);
}

/* 
    Exports all documents in collection [collectionName] of db [dbName] 
    locally as json file ([collectionName].json) in 'data' folder.
    Returns: documents as an Object array.
 */
dbName = "test";
collectionName = "countrydata";


// MongoClient.connect(connectionUrl, { useUnifiedTopology: true }).then(function(client) {
//     db = client.db(dbName);
//     collection = db.collection(collectionName);
//     let docs = collection.find().toArray();
//     return docs;
// }).then(function(docs){
//     let fileName = './data/'+collectionName+'local.json';
//     let json = JSON.stringify(docs);
//     fs.writeFile(fileName, json, 'utf8', function callback(err, res){
//         if (err){
//             console.log(err);
//         } else {
//            console.log('Saved data in '+collectionName+' as '+fileName); 
//         }
//     });
//     return docs;
// }).catch((err) => errCallback(err));  


/*
    Adding/Updating documents in collection [collectionName] of database [dbName]
*/
MongoClient.connect(connectionUrl, {useUnifiedTopology: true}).then(function(client) {
    db = client.db(dbName);
    collection = db.collection(collectionName);

    // Appends document [document] to collection [collectionName] of db [dbName].
    document = {"test":"working"};
    collection.insertOne(document, err => errCallback(err));

    // Appends documents [documents] into collection [collectionName] of db [dbName].
    documents = [{"test1":"working1"}, {"test2":"working2"}];
    collection.insertMany(documents, err => errCallback(err));

    // Applies update [update] to records in [collectionName] that match [criteria]
    criteria = {Country : "United States of America"};
    modify = {TotalDeaths : 0};
    increment = {NewDeaths : 826};
    update = {$set : modify, $inc : increment}
    collection.updateMany(criteria, update, err => errCallback(err));

});



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

// });

module.exports = router;


