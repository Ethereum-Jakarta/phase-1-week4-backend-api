const express = require('express');
// const bodyParser = require('body-parser');
const api = require('./api');

const app = express();
const port = 3000;
app.use(express.json());

app.use('/api', api);

app.listen(port, function() {
    console.log(`Server running at port +`, port);
})

// app.use(bodyParser.urlencoded({extended : true}));
