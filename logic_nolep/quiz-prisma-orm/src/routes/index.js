const express = require('express');
const router = express.Router();

const routeUser = require('./user.route');
const routeTodo = require('./todo.route');

router.use('/user', routeUser);
router.use('/todo', routeTodo);

module.exports = router;