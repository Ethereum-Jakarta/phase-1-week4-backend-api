// const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { prisma } = require('../../prisma');
// const ApiError = require('../../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // eslint-disable-next-line no-param-reassign
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: userBody,
  });
};

const getAllUsers = async (pageSize, skip) => {
  const users = await prisma.user.findMany({
    skip,
    take: pageSize,
  });

  return users;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

const updateUser = async (id, updateBody) => {
  const user = await prisma.user.update({
    where: { id },
    data: updateBody,
  });
  return user;
};

const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: { id },
  });
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

const getProductByUser = async (userId) => {
  const products = await prisma.product.findMany({
    where: { userId },
  });

  return products;
};
const getOrderByUser = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
  });

  return orders;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getProductByUser,
  getOrderByUser,
};
