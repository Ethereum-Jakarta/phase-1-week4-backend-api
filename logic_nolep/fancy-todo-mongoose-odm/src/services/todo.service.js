const Todo = require('../models/Todo.model');

class TodoService {
  async createTodo(TodoData) {
    try {
      const todo = new Todo(TodoData);
      await todo.save();
      return todo;
    } catch (error) {
      throw error;
    }
  }

  async getTodos() {
    try {
      const todos = await Todo.find();
      return todos;
    } catch (error) {
      throw error;
    }
  }

  async getTodo(TodoId) {
    try {
      const todo = await Todo.findById(TodoId);
      if (!todo) {
        throw new Error('Todo not found');
      }
      return todo;
    } catch (error) {
      throw error;
    }
  }

  async updateTodo(TodoId, updateData) {
    try {
      const todo = await Todo.findByIdAndUpdate(TodoId, updateData, { new: true });
      if (!todo) {
        throw new Error('Todo not found');
      }
      return todo;
    } catch (error) {
      throw error;
    }
  }

  async deleteTodo(TodoId) {
    try {
      const todo = await Todo.findByIdAndDelete(TodoId);
      if (!todo) {
        throw new Error('Todo not found');
      }
      return todo;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TodoService();
