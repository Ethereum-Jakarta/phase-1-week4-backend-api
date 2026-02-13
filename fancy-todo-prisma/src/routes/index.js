const express = require("express");
const router = express.Router();
const userRoute = require("./user.route.js");
const todoRoute = require("./todo.route.js");

router.use("/user", userRoute);
router.use("/todo", todoRoute);

module.exports = router;