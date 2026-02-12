const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  resolve();
};

/**
 * @Any Role
 */
const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

/**
 * @Admin Role
 */
const adminAuth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => {
      if (req.user.role === 'admin') {
        next();
      } else {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  auth,
  adminAuth,
};
