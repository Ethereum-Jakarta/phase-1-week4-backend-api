const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');

// Function autentikasi user berdasarkan email dan password
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email); // Mengecek apakah email cocok
  const validPassword = await bcrypt.compare(password, user.password); // Membandingkan password sekarang dan password yang telah di hash

  if (!user || !validPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

module.exports = { loginUserWithEmailAndPassword };
