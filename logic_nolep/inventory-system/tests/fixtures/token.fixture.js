const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/token');
const { userOne, admin } = require('./user.fixture');

const SECRET_KEY = config.jwt.secret;

const generateToken = (userId, role, expiresIn, type) => {
  const payload = {
    sub: userId,
    role,
    type,
    exp: Math.floor(
      moment()
        .add(expiresIn || 30, 'minutes')
        .valueOf() / 1000
    ),
  };
  return jwt.sign(payload, SECRET_KEY);
};

const userOneAccessToken = generateToken(userOne.id, userOne.role, config.jwt.accessExpirationMinutes, tokenTypes.ACCESS);
const adminAccessToken = generateToken(admin.id, admin.role, config.jwt.accessExpirationMinutes, tokenTypes.ACCESS);

module.exports = {
  userOneAccessToken,
  adminAccessToken,
};
