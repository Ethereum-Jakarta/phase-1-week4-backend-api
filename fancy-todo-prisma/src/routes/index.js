const express = require("express");
const router = express.Router();
const userRouter = require("./user.route")
const todoRouter = require("./todo.route")


router.use("/user", userRouter)
router.use("/todo", todoRouter)

module.exports = router;
