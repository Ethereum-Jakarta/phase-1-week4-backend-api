const bcrypt = require('bcrypt');
const prisma = require('../../prisma/client');

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
    where: {email},
  });
};

const getUser = async (options, filter) => {
  const page = Number(options.skip) || 0;
  const size = Number(options.take) || 5;

  options = {
    skip: page,
    take: size,
    where: {
      name: filter,
    },
  };

  return prisma.user.findMany(options);
};

const getOrderAndProductByUser = async (name) => {
  return prisma.user.findFirst({
    where: {
      name,
    },
    include: {
      products: true,
      orders: true,
    },
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUser,
  getOrderAndProductByUser,
};
