const express = require("express");
const router = express.Router();
const todoController = require("../controller/todo.controller")

router
    .route('/')
    .get(todoController.getTodos)
    .post(todoController.createTodo)

router
    .route('/findByUserId/:userId')
    .get(todoController.findTodoByUserId)
router
    .route('/:todoId')
    .get(todoController.findTodo)
    .put(todoController.updateTodo)
    .delete(todoController.deleteTodo)
module.exports = router;