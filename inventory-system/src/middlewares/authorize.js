const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');


const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }
    next();
  };
};

module.exports = authorize;
