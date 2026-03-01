const bcrypt = require('bcrypt');
const prisma = require('../../prisma/client');

const getUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};

const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

const createUser = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  return user;
};

const updateUser = async (userId, { name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, email, password: hashedPassword, role },
  });

  return user;
};

const deleteUser = async (userId) => {
  const user = await prisma.user.delete({
    where: { id: userId },
  });

  return user;
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
