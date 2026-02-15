const todoService = require("@services/todo.service");

const createTodo = async (req, res) => {
  try {
    const create = await todoService.createTodo(req.body);
    return res.status(201).json(create);
  } catch (error) {
    console.error("Error creating todo:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to create todo", error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await todoService.deleteTodo(id);
    return res.status(200).json({ message: "Todo deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting todo:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to delete todo", error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await todoService.updateTodo(id, req.body);
    return res.status(200).json({ message: "Todo updated", data: updated });
  } catch (error) {
    console.error("Error updating todo:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update todo", error: error.message });
  }
};

const getAllTodos = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    return res.status(200).json({ message: "Get all todos", data: todos });
  } catch (error) {
    console.error("Error getting todos:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to get todos", error: error.message });
  }
};

module.exports = { createTodo, getAllTodos, updateTodo, deleteTodo };
