const express = require("express");
const checkUserExists = require("../middleware/checkUserExists");

const {
  createTodoController,
  getAllTodosController,
  getTodoByIdController,
  updateTodoController,
  deleteTodoController,
  getAllTodosByUserController
} = require("../controllers/todo.controller");

const router = express.Router();

router.post("/", checkUserExists, createTodoController);
router.get("/", getAllTodosController);
router.get("/:id", getTodoByIdController);
router.put("/:id", updateTodoController);
router.delete("/:id", deleteTodoController);
router.get('/byUser/:userId', getAllTodosByUserController);

module.exports = router;
