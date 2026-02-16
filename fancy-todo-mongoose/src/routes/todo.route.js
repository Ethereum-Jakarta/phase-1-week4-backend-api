const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo.controller");

router.route("/")
  .get(todoController.getTodos)
  .post(todoController.createTodo);

router
  .route("/:id")
  .get(todoController.getTodo)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

router.get("/getByUserId/:userId", todoController.getTodoByUserId);
module.exports = router;
