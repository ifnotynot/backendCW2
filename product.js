// dependency modules
const express = require("express");
//const bodyParser = require("body-parser");

//dev express instance
const app = express();
//change express
app.use(express.json());
app.set("port", 4000);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","*");
    next();
});

//connetion to MongoDB
const MongoClient = require("mongodb").MongoClient;
let db;
MongoClient.connect("mongodb+srv://ifnotynot:<Wiigames009>@cluster0.yii15.mongodb.net", (err, client) => {
    db = client.db("webstore");
});
//display a message for root path
 //to show that API is working
app.get("/", (req, res, next) => {
    res.send("Select a collection, e.g /collection/messages");
});

// get the collection name

app.param("collectionName", (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    console.log("collection Name:", req.collection);
    return next();

});
//get all the objects from a collection
app.get("/collection/:collectionName", (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e);
        res.send(results);
    })
});

//post  data to the new collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})
//return  object id
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id',(req,res,next)=>{
    req.collection.findOne(
        {_id: new ObjectID(req.params.id)}, (e,result)=>{
            if(e) return next(e);
            res.send(result);
        }
    )
    });
//updating an object
app.put('/collection/:collectionName/:id',(req,res,next)=>{
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe:true, multi:false},
        (e,result) =>{
            if(e) return next(e)
            res.send((result.result.n===1)? {msg: "success"}: {msg: 'error'})
        }

    )
});

//delete object
app.delete('/collection/:collectionName/:id',(req,res,next)=>{
    req.collection.deleteOne(
        {_id:ObjectID(req.params.id)} , (e,result)=>{
            if(e) return next(e)
            res.send((result.result.n===1))?
            {msg:'success'} : {msg:'error'}
        }
    )
});

//set  port
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
