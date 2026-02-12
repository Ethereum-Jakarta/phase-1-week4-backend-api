const express = require("express");
const api = require("./api");

const app = express(),
    port = 3000;

app.use(express.json());

app.use("/api", api);

app.listen(port, function () {
	console.log("Server is listening at port:" + port);
});
