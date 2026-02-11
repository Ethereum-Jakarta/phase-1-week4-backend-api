const express = require('express');
const { authAdmin } = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.route('/').get(authAdmin(), userController.getUsers);

router.route('/:name').get(authAdmin(), userController.getOrderAndProduct);

router.route('/:email').get(authAdmin(), userController.UserByEmail);

module.exports = router;
