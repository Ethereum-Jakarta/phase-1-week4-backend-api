const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../service/index');
const ApiError = require('../utils/apiError');

const getAllUsers = catchAsync(async (req, res) => {
  const filter = {
    role: req.query.role,
  };
  const option = {
    skip: parseInt(req.query.skip, 10) || 0,
    take: parseInt(req.query.take, 10) || 10,
  };
  const result = await userService.getAllUsers(filter, option);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get All Users Success!',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await userService.getUserById(req.params.userId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User By ID Success',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await userService.updateUser(req.params.userId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update User Success!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await userService.deleteUser(req.params.userId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update User Success!',
    data: result,
  });
});

const getProductByUser = catchAsync(async (req, res) => {
  const result = await userService.getProductByUser(req.params.userId);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product By User Success!',
    data: result,
  });
});

const getOrderByUser = catchAsync(async (req, res) => {
  const result = await userService.getOrderByUser(req.params.userId);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order By User Success!',
    data: result,
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProductByUser,
  getOrderByUser,
};
