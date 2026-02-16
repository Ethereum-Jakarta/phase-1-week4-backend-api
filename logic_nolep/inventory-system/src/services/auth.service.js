const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

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

module.exports = {
  loginUserWithEmailAndPassword,
};