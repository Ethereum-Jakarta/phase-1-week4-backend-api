const express = require("express");
const router = express.Router();

const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
} = require("../controllers/todo.controller.js");

router.route("/")
    .get(getTodos)
    .post(createTodo);

router.route("/:id")
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo);

module.exports = router;