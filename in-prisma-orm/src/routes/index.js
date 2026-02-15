const express = require("express");
const router = express.Router();


const todoRoutes = require("./todo.route");
const userRoutes = require("./user.route");


router.use(todoRoutes);
router.use(userRoutes);

module.exports = router;
