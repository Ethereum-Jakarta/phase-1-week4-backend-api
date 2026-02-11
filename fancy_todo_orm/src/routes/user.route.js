const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.route("/user")
	.get(userController.getUsers)
	.post(userController.createUser)
router.route("/user/:id")
	.put(userController.updateUser)
	.delete(userController.deleteUser)

module.exports = router
