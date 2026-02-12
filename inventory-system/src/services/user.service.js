const bcrypt = require('bcryptjs');
const prisma = require('../../prisma');

const getAllUsers = async (skip = 0, limit = 10) => {
  const result = await prisma.user.findMany({
    take: parseInt(limit),
    skip: parseInt(skip),
  });

  const resultCount = await prisma.user.count({ skip: parseInt(skip) });
  const totalPage = Math.ceil(resultCount / limit);

  return { totalPage, totalData: resultCount, data: result };
};

const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

const updateUser = async (userId, userBody) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: userBody,
  });

  return user;
};

const deleteUser = async (userId) => {
  const deleleteDataUser = await prisma.user.deleteMany({
    where: { id: userId },
  });

  return deleleteDataUser;
};

const createUser = async (userBody) => {
  const hashPassword = bcrypt.hashSync(userBody.password, 8);

  const user = await prisma.user.create({
    data: {
      ...userBody,
      password: hashPassword,
    },
  });

  return user;
};

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const getProductsByUser = async (userId) => {
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
  });

  return products;
};

const getOrdersByUser = async (userId) => {
  const products = await prisma.order.findMany({
    where: {
      userId,
    },
  });

  return products;
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  getUserByEmail,
  getProductsByUser,
  getOrdersByUser,
};
