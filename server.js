const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT || 2121;
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'LogIt'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
// app.use(express.static('public'))
// app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname +''))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('materials').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.get('/material',(request, response)=>{
    db.collection('materials').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('material.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addMaterial', (request, response) => {
    db.collection('materials').insertOne({brand: request.body.brand,
    product: request.body.product, likes: 0})
    .then(result => {
        console.log('Material Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    console.log(request.body.brand)
    db.collection('materials').updateOne({brand: request.body.brand, material: request.body.material, likes: request.body.likes},{
        $set: {
            likes:request.body.likes + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteMaterial', (request, response) => {
    db.collection('materials').deleteOne({brand: request.body.brand})
    .then(result => {
        console.log('material (brand) deleted')
        response.json('material (brand) deleted')
    })
    .catch(error => console.error(error))

})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})