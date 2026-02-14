const prisma = require('../../prisma/client');

const getAllTodos = async () => {
  const Todo = await prisma.todo.findMany();

  return Todo;
};

const getTodo = async (TodoId) => {
  const Todo = await prisma.todo.findUnique({
    where: {
      id: TodoId,
    },
  });

  return Todo;
};

const createTodo = async (title, description, status, userId) => {
  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      status,
      userId,
    },
  });

  return todo;
};

const updateTodo = async (title, description, status, userId, todoId) => {
  const todo = await prisma.todo.update({
    where: {
      id: todoId,
    },
    data: {
      title,
      description,
      status,
      userId,
    },
  });
  return todo;
};

const deleteTodo = async (todoId) => {
  const todo = await prisma.todo.delete({
    where: {
      id: todoId,
    },
  });

  return todo;
};

module.exports = { getTodo, getAllTodos, createTodo, updateTodo, deleteTodo };
