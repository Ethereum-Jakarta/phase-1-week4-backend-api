const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const todoRouter = require('./todo.route');

router.use(userRouter);
router.use(todoRouter);

module.exports = router;