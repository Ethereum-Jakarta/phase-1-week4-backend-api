const httpStatus = require('http-status');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getUsers = catchAsync(async (req, res) => {
  const { search, page, size } = req.query;

  const filter = {
    contains: search,
  };

  const options = {
    skip: page,
    take: size,
  };

  const user = await userService.getUser(options, filter);

  if (!user || user.length == 0) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get All User Success',
    data: user,
  });
});

const UserByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User Succes',
    data: user,
  });
});

const getOrderAndProduct = catchAsync(async (req, res) => {
  const { name } = req.params;
  const user = await userService.getOrderAndProductByUser(name);

  if (!user || user.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order And Product By User Succes',
    data: user,
  });
});

module.exports = {
  UserByEmail,
  getUsers,
  getOrderAndProduct,
};
