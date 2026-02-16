const Todo = require("../models/todo.model");

const getTodos = async () => {
  const todo = await Todo.find();
  return todo;
};

const getTodo = async (_id) => {
  const todo = await Todo.findById(_id)
  return todo
}
const getTodoByUserId = async (_id) => {
  const todo = await Todo.find({
    userId: _id
  })
  return todo
}

const createTodo = async (title, description, status, userId) => {
  const todo = await Todo.create({ title, description, status, userId });
  return todo;
};

const updateTodo = async (title, description, status, userId, _id) => {
  const todo = await Todo.updateOne({ _id }, { title, description, status, userId });
  return todo;
};

const deleteTodo = async (_id) => {
  const todo = await Todo.deleteOne({ _id });
  return todo;
};

module.exports = {
  getTodos,
  getTodo,
  getTodoByUserId,
  createTodo,
  updateTodo,
  deleteTodo,
};
