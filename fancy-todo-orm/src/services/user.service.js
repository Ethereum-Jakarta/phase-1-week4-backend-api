const prisma = require('../../prisma/client');

const getAllUsers = async () => {
  const user = await prisma.user.findMany({
    include: {
      todos: true,
    },
  });

  return user;
};

const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      todos: true,
    },
  });

  return user;
};

const createUser = async (name, email, phone) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
    },
  });

  return user;
};

const updateUser = async (name, email, phone, userId) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      phone,
    },
  });
  return user;
};

const deleteUser = async (userId) => {
  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return user;
};

module.exports = { getUser, getAllUsers, createUser, updateUser, deleteUser };
