const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const prisma = require('../../prisma');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  const validPassword = await bcrypt.compare(password, user.password);

  if (!user || !validPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (token) => {
  const currentToken = await prisma.token.findMany({
    where: {
      token: {
        equals: token
      }
    }
  })

  if (!currentToken.length) throw new ApiError(httpStatus.NOT_FOUND, "token not found");

  const tokenId = currentToken[0].id

  const deleteToken = await prisma.token.delete({
    where: { id: tokenId }
  })

  return deleteToken
}

module.exports = {
  loginUserWithEmailAndPassword,
  logout
};
