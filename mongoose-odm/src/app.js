const express = require('express');
const bodyParser = require('body-parser');
const api = require('./services/api');

const port = 3000;
const app = express();

app.use(express.json());
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));
// Parses the text as json
app.use(bodyParser.json());

app.use(api);

app.listen(port, function () {
	console.log("Server is listening at port:" + port);
});



