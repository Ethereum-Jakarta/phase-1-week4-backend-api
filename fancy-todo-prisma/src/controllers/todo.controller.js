const todoService = require("../service/todo.service");

const getTodos = async (req, res) => {
  try {
    const result = await todoService.getTodos();
    res.status(200).send({
      status: 200,
      message: "Get Todo Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await todoService.getTodo(id);
    res.status(200).send({
      status: 200,
      message: "Get Todo Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getTodoByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await todoService.getTodoByUserId(id);
    res.status(200).send({
      status: 200,
      message: "Get Todo by User Id Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description, status, userId } = req.body;
    const result = await todoService.createTodo(title, description, status, userId);
    res.status(200).send({
      status: 200,
      message: "Create Todo Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const updateTodo = async (req, res) => {
  try {
    const { title, description, status, userId } = req.body;
    const id = req.params.id;
    const result = await todoService.updateTodo(
      title,
      description,
      status,
      userId,
      id
    );
    res.status(200).send({
      status: 200,
      message: "Update Todo Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await todoService.deleteTodo(id);
    res.status(200).send({
      status: 200,
      message: "Delete Todo Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createTodo,
  updateTodo,
  getTodo,
  getTodos,
  deleteTodo,
  getTodoByUserId,
};
