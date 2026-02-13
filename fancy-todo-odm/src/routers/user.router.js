const express = require('express')
const router = express.Router();
const userController = require('../controller/user.controller')

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router