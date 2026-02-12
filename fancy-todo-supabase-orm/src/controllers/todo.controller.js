const todoService = require("../service/todo.service");

const createTodoController = async (req, res) => {
  try {
    const newTodo = await todoService.createTodo(req.body);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTodosController = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTodoByIdController = async (req, res) => {
  const todoId = req.params.id;
  try {
    const todo = await todoService.getTodoById(todoId);
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTodoController = async (req, res) => {
  const todoId = req.params.id;
  const todoData = req.body;
  try {
    const updatedTodo = await todoService.updateTodo(todoId, todoData);
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTodoController = async (req, res) => {
  const todoId = req.params.id;
  try {
    await todoService.deleteTodo(todoId);
    res.status(200).json({ message: "Todo has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTodosByUserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const todos = await todoService.getAllTodosByUser(userId);
    if (todos.length === 0) {
      return res.status(404).json({ message: "No Todos found for this user." });
    }
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTodoController,
  getAllTodosController,
  getTodoByIdController,
  updateTodoController,
  deleteTodoController,
  getAllTodosByUserController,
};
