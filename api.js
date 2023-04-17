require("dotenv").config();
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const DB_URI = process.env.DB_URI



const port = 8000
app.use(cors())
app.use(express.json())

const Auth = require('./controllers/auth-controller')
const Tracks = require('./controllers/track-controller')

const authMiddleware = require('./middlewares/session')


mongoose.connect(DB_URI)

app.post('/register', Auth.register)
app.post('/login', Auth.login)

app.get('/tracks', authMiddleware, Tracks.list)
app.post('/tracks', authMiddleware, Tracks.create)
app.put('/tracks/:id', authMiddleware, Tracks.update)
app.delete('/tracks/:id', authMiddleware, Tracks.destroy)

app.use('/client', express.static('client'))

app.use(express.static('app'))


app.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(`${__dirname}/index.html`)
})
app.get('*', (req, res) => {
    res.status(404).send('Not found');
})
app.listen(port, () => {
    console.log('Started')
})