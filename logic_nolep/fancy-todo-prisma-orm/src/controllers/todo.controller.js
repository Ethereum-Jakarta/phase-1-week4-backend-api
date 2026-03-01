const todoService = require("../services/todo.service");

const handleResponse = (res, status, message, data = null, error = null) => {
  res.status(status).json({
    status,
    message,
    data,
    error,
  });
};

const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getTodos();
    handleResponse(res, 200, "Success get todos!", todos);
  } catch (err) {
    handleResponse(res, 500, "Failed to get todos!", null, err.message);
  }
};

const getTodo = async (req, res) => {
  try {
    const todo = await todoService.getTodo(req.params.id);
    handleResponse(res, 200, "Success get todo!", todo);
  } catch (err) {
    handleResponse(res, 500, "Failed to get todo!", null, err.message);
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description, status, userId } = req.body;
    const createTodo = await todoService.createTodo({
      title,
      description,
      status,
      userId,
    });
    handleResponse(res, 200, "Success create todo!", createTodo);
  } catch (err) {
    handleResponse(res, 500, "Failed to create todo!", null, err.message);
  }
};

const updateTodo = async (req, res) => {
  try {
    const { title, description, status, userId } = req.body;
    const todoId = parseInt(req.params.id, 10);
    const updatedTodo = await todoService.updateTodo(todoId, {
      title,
      description,
      status,
      userId,
    });
    handleResponse(res, 200, "Success update todo!", updatedTodo);
  } catch (err) {
    handleResponse(res, 500, "Failed to update todo!", null, err.message);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await todoService.deleteTodo(req.params.id);
    handleResponse(res, 200, "Success delete todo!", deletedTodo);
  } catch (err) {
    handleResponse(res, 500, "Failed to delete todo!", null, err.message);
  }
};

module.exports = { getTodos, getTodo, createTodo, updateTodo, deleteTodo };
