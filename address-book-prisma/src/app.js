const express = require("express");
const { contactRouter, groupRouter, groupContactRouter } = require("./routes/index");

const app = express(),
	PORT = 3000;

app.use(express.json());

app.use("/contact", contactRouter);
app.use("/group", groupRouter);
app.use("/group-contact", groupContactRouter);

module.exports = {
	app,
	PORT,
};
