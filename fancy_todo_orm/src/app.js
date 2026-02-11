const express = require("express");
const router = require('./routes/index.js')
const bodyParser = require("body-parser")
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(router.user, router.todo)
app.use(bodyParser.json())

module.exports = app;