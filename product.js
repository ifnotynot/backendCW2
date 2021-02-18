//import modules
const exp = require('express')
const { ObjectID } = require('mongodb')

//const bodyParser = require('body-parser')

//create an express js instance
const app = exp()

//config express js
app.use(exp.json())
app.use(express.static("public"))

const port = process.env.PORT || 3000


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    res.setHeader('Access-Control-Allow-Origin', '*');

    next()
})

//Connect to mongodb
const MongoClient = require('mongodb').MongoClient
let db
MongoClient.connect('mongodb+srv://ifnotynot:Wiigames009@cluster0.yii15.mongodb.net', (err, client) => {
    db = client.db('cw2')
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

//display a message or root path to show that API is working
app.get('/', (req, res, next) => {
    res.render("index.html");
    next();
})


//retrieve all the objects from collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})
//retrieve all the objects from collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (err,result)=>{
        if(err) return next(err);
        res.send(result.ops);
    })
})

//retrieve customer orders by name and phone
app.get('/collection/:collectionName/:name/:phone', (req, res, next) => {
    req.collection.find({
        name: (req.params.name),
        phone: (req.params.phone)
    }).toArray((e,result)=>{
        if(e) return next(e)
        res.send(result)
    })
})


app.listen(port, () => {
    console.log('Express js server runnning on localhost:3000')
})