const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

const createTodo = async (todoData) => {
  try {
    return await prisma.todo.create({ data: todoData });
  } catch (error) {
    throw new Error(`Error creating todo: ${error.message}`);
  }
};

const getAllTodos = async () => {
  return await prisma.todo.findMany();
};

const getTodoById = async (id) => {
  return await prisma.todo.findUnique({ where: { id } });
};

const updateTodo = async (id, todoData) => {
  return await prisma.todo.update({
    where: { id },
    data: todoData,
  });
};

const deleteTodo = async (id) => {
  return await prisma.todo.delete({ where: { id } });
};

const getAllTodosByUser = async (userId) => {
    return await prisma.todo.findMany({
      where: { userId: userId },
    });
  };

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getAllTodosByUser,
};
