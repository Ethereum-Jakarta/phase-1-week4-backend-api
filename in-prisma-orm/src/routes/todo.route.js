const express = require("express");
const router = express.Router();
const {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
} = require("@controllers/todo-controller");



router.route("/todo").get(getAllTodos).post(createTodo);
router.route("/todo/:id").put(updateTodo).delete(deleteTodo);

module.exports = router