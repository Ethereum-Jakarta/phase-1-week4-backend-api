const express = require("express");
const router = express.Router();
const userRouter = require("./user.route");
const todoRouter = require("./todo.route");

router.get("/", (req, res) => {
  res.send("Hello, world from router!");
});
router.use("/user", userRouter);
router.use("/todo", todoRouter);

module.exports = router;
