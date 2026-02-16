const prisma = require("../../prisma/client");

const getTodos = async () => {
  const todo = await prisma.todo.findMany();
  return todo;
};

const getTodo = async (id) => {
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });
  return todo;
};

const getTodoByUserId = async(userId) => {
  const todo = await prisma.todo.findMany({
    where: {
      userId
    }
  });
  return todo;
}

const createTodo = async (title, description, status, userId) => {
  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      status,
      userId
    },
  });
  return todo;
};

const updateTodo = async (title, description, status, userId, id) => {
  const todo = await prisma.todo.update({
    where: {
      id: id,
    },
    data: {
      title,
      description,
      status,
      userId
    },
  });
  return todo;
};
const deleteTodo = async (id) => {
  const todo = await prisma.todo.delete({
    where: {
      id: id,
    },
  });
  return todo;
};

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  getTodoByUserId,
};
