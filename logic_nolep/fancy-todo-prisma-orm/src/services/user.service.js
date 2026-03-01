const prisma = require("../../prisma/client");

const getUsers = async () => {
  return await prisma.user.findMany();
};

const getUser = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });
};

const createUser = async ({ name, email, phone }) => {
  return await prisma.user.create({
    data: { name, email, phone },
  });
};

const updateUser = async (userId, { name, email, phone }) => {
  return await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: { name, email, phone },
  });
};

const deleteUser = async (userId) => {
  return await prisma.user.delete({
    where: { id: parseInt(userId, 10) },
  });
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
