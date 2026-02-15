const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

module.exports = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, config.jwt.secret);

  const user = await userService.getId(payload.sub);

  user.role = user.role.toLowerCase();

  if (user.role !== 'admin') {
    res.status(httpStatus.UNAUTHORIZED, 'Only admin can perform this action').send({
      status: httpStatus.UNAUTHORIZED,
      message: 'Only admin can perform this action',
    });
  } else {
    return next();
  }
});
