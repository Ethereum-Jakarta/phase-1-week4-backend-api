const express = require("express");
const app = express();
const routes = require('./routes')


app.use(express.json());
app.use("/api", routes);  // Prefix "/api"


app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
