const express = require('express')
const router = require('./routers')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use(router)

module.exports = app;
