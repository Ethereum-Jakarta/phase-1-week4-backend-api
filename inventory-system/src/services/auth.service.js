const { status } = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const tokenService = require('./token.service')

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
    throw new ApiError(status.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout by blacklisting refresh token
 * @param {string} refreshToken
 */
const logout = async (refreshToken) => {
  await tokenService.blacklistToken(refreshToken);
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout
};
