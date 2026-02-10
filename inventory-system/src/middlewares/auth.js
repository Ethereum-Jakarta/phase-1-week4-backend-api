const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
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

const authAdmin = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => {
      if (req.user.role === 'admin') {
        next();
      } else {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access Denied');
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  auth,
  authAdmin,
};
