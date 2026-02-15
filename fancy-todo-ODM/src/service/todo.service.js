const Todo = require('../models/todo.model');

const createTodo = async (document) => {
  try {
    const todo = new Todo(document);
    return await todo.save();
  } catch (error) {
    throw error;
  }
};

const readTodo = async (getPopulate) => {
  try {
    const query = Todo.find().populate(getPopulate);
    const todo = await query;
    return todo;
  } catch (error) {
    throw error;
  }
};

const updateTodo = async (query, update) => {
  try {
    const todo = await Todo.updateOne(query, update);
    return todo;
  } catch (error) {
    throw error;
  }
};

const deleteTodo = async (id) => {
  try {
    const todo = await Todo.deleteOne(id);
    return todo;
  } catch (error) {
    throw error;
  }
};

module.exports = { createTodo, readTodo, updateTodo, deleteTodo };
