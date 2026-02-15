const prisma = require('../../prisma/client');

const createTodo = async (data) => {
  try {
    const newTodo = await prisma.todo.create({
      data: data,
    });
    return newTodo;
  } catch (error) {
    throw error;
  }
};

const readTodo = async () => {
  try {
    const readTodo = await prisma.todo.findMany();
    return readTodo;
  } catch (error) {
    throw error;
  }
};

const updateTodo = async (todoId, update) => {
  try {
    const updateTodo = await prisma.todo.update({
      where: { id: todoId },
      data: update,
    });
    return updateTodo;
  } catch (error) {
    throw error;
  }
};

const deleteTodo = async (todoId) => {
  try {
    const deleteTodo = await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });
    return deleteTodo;
  } catch (error) {
    throw error;
  }
};

module.exports = { createTodo, readTodo, updateTodo, deleteTodo };
