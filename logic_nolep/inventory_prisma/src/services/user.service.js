const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Get user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
async function getUserById(userid) {
  return prisma.user.findUnique({
    where: {
      id: userid,
    },
  });
}

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
 * Get user
 * @param {object} options
 * @returns {Promise<User>}
 */
async function getUser(options) {
  return prisma.user.findMany({
    take: +options.take || 5,
    skip: +options.skip || 0,
  });
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {object} updateBody
 * @returns {Promise<User>}
 */
async function updateUser(userId, updateBody) {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  updateBody.password = bcrypt.hashSync(updateBody.password, 8);
  const resultUpdate = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateBody,
  });

  return resultUpdate;
}

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
async function deleteUser(userId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return deletedUser;
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserByEmail,
};
