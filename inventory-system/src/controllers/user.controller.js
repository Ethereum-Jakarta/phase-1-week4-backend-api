const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../service/user.service');
const ApiError = require('../utils/ApiError');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Create Users Successfully',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const { page, size } = req.query;

  // Konversi ke bilangan bulat (integer)
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(size, 10);

  if (Number.isNaN(pageNumber) || Number.isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
    throw new Error('Invalid page or size parameters');
  }

  // Hitung berapa data yang perlu dilewati (skip)
  const skip = (pageNumber - 1) * pageSize;

  const users = await userService.getAllUsers(pageSize, skip);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get Users Successfully',
    data: users,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Users Success',
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.userId;
  const result = await userService.updateUser(id, req.body);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Update Users Successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.userId;
  await userService.deleteUser(id);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Delete Users Successfully',
    data: null,
  });
});

const getProductByUser = catchAsync(async (req, res) => {
  const result = await userService.getProductByUser(req.params.userId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product Success',
    data: result,
  });
});

const getOrderByUser = catchAsync(async (req, res) => {
  const result = await userService.getOrderByUser(req.params.userId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Success',
    data: result,
  });
});

module.exports = { createUser, getUserById, getAllUsers, updateUser, deleteUser, getProductByUser, getOrderByUser };
