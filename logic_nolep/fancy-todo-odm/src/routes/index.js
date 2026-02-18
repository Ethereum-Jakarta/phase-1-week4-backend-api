const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const todoRoute = require('./todo.route');

router.use('/user', userRoute);
router.use('/todo', todoRoute);

module.exports = router;