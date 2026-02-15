const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  userBody.password = bcrypt.hashSync(userBody.password, 8);
  
  return prisma.user.create({
    data: userBody,
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Get all user
 * @param {Object} filter
 * @param {Object} options
 * @param {Object} sorting
 * @returns {Promise<User[]>}
 */
const getAll = async (filter, options, sorting) => {
  return prisma.user.findMany({
    ...options,
    where: filter,
    orderBy: sorting,
  });
};

const getId = async (id) => {
  return prisma.user.findFirst({
    where: {
      id: id,
    },
  });
};

const update = async (id, update) => {
  const user = await getId(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (update.password !== undefined) update.password = bcrypt.hashSync(update.password, 8);
  const updateUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: update,
  });

  return updateUser;
};

const deleted = async (id) => {
  const user = await getId(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const deleteUser = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return deleteUser;
};

const getProducts = async (filter, options, sorting) => {
  return prisma.product.findMany({
    ...options,
    where: filter,
    orderBy: sorting,
  });
};

const getOrders = async (filter, options, sorting) => {
  return prisma.orders.findMany({
    ...options,
    where: filter,
    orderBy: sorting,
  });
};

module.exports = { createUser, getUserByEmail, getAll, getId, update, deleted, getProducts, getOrders };
