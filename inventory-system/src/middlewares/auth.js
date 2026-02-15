const passport = require('passport');
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
// const tokenService = require('../services/token.service')

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
  }


  req.user = user;

  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
