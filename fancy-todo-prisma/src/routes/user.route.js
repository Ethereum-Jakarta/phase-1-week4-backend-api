const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.route('/')
    .get(userController.showUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router