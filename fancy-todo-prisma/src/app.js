const express = require('express');
const app = express();
const router = require('../src/routes/index');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is online');
});

app.use(router);

module.exports = app;
