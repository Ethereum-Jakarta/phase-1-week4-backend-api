const { status } = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  userBody.password = await bcrypt.hash(userBody.password, 8);

  return await prisma.user.create({
    data: userBody,
  });
};

/**
 * Get all users
 * @returns {Promise<QueryResult>}
 */
const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total: totalUsers,
    page,
    totalPages: Math.ceil(totalUsers / limit),
  };
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Update user by ID
 * @param {string} id
 * @returns {Promise<User>}
 */

const updateUserByid = async (id, updateData) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }
  return await prisma.user.update({
    where: { id },
    data: { ...updateData },
  });
};

/**
 * Update user by ID
 * @param {string} id
 * @returns {Promise<User>}
 */

const deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUserByid,
  deleteUserById,
  getUserById,
  getAllUsers,
};
