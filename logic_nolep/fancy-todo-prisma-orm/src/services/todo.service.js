const prisma = require("../../prisma/client");

const getTodos = async () => {
  return await prisma.todo.findMany();
};

const getTodo = async (todoId) => {
  return await prisma.todo.findUnique({
    where: { id: parseInt(todoId, 10) },
  });
};

const createTodo = async ({ title, description, status, userId }) => {
  return await prisma.todo.create({
    data: { title, description, status, userId: parseInt(userId, 10) },
  });
};

const updateTodo = async (todoId, { title, description, status, userId }) => {
  return await prisma.todo.update({
    where: { id: parseInt(todoId, 10) },
    data: { title, description, status, userId: parseInt(userId, 10) },
  });
};

const deleteTodo = async (todoId) => {
  return await prisma.todo.delete({
    where: { id: parseInt(todoId, 10) },
  });
};

module.exports = { getTodos, getTodo, createTodo, updateTodo, deleteTodo };
