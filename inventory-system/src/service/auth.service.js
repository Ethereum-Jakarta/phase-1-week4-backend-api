const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const { prisma } = require('../../prisma');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  const validPassword = await bcrypt.compare(password, user.password);

  if (!user || !validPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (token) => {
  const currentToken = await prisma.token.findFirst({
    where: {
      token,
    },
  });

  if (!currentToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }

  const updatedToken = await prisma.token.update({
    where: {
      id: currentToken.id,
    },
    data: {
      blacklisted: true,
    },
  });

  return updatedToken;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
};
