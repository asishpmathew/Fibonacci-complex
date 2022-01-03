const keys = require('./keys')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

//PG client setup
const {Pool} = require('pg')
const pgClient = new Pool({
    user : keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort

})

pgClient.on('error', () => console.log('Lost pg connections'))

pgClient.on("connect", (client) => {
    client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

//redis client setup
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate()

//express route handlers

app.get('/', (req, res) =>{
    res.send('Hi')
});

app.get('/values/all', async(req,res) => {
    const value = await pgClient.query('SELECT * from values')
    res.send(value.rows)
});

app.get('/values/all' , async(req, res) =>{
 redisClient.hGetAll('values', (err, values) =>{
        res.send(values)
    })
});

app.post('/values' , async(req, res) =>{
   const index = req.body.index;
   if(parseInt(index) > 40) {
       return res.status(422).send('Index too high')
   } 

   redisClient.hSet('values', index, 'Nothing yet')
   redisClient.publish('insert', index)
   pgClient.query('INSERT INTO values($1)', [index])

   res.send({ working :true})
})

app.listen( 5000, err => {
    console.log('Listening....')
})