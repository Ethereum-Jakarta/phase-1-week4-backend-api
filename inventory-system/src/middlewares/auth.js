const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject, requiredRole) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  // console.log(user.role);
  
  if (requiredRole && user.role !== requiredRole) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
  }
  
  req.user = user;
  resolve();
};

const auth = (requiredRole) => async (req, res, next) => {
  // console.log(requiredRole);
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRole))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
