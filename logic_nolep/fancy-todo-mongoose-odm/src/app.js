const express = require("express");
const router = require("./routes")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(router)

module.exports = app;