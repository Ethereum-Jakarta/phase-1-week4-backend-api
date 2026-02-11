const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo.controller')

router.route("/todo")
	.get(todoController.getTodo)
	.post(todoController.createTodo)
router.route("/todo/:id")
	.put(todoController.updateTodo)
	.delete(todoController.deleteTodo)

module.exports = router