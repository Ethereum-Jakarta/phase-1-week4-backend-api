const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

const getUser = catchAsync(async (req, res) => {
  const options = {
    take: parseInt(req.query.take) || 5,
    skip: parseInt(req.query.skip) || 0   
  };
  const user = await userService.getUser(options);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User Success',
    data: user
  });
});

const createUser = catchAsync(async (req, res) => {
  const newUser = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.OK,
    message: 'Create User Success',
    data: newUser
  });
});

const findUserbyId = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User Success',
    data: user
  });
});

const updateUser = catchAsync(async (req, res) => {
  const updatedUser = userService.updateUser(req.params.userId, req.body);
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update User Success',
    data: updatedUser
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.userId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete User Success',
    data: null
  });
});

module.exports = { 
  getUser, 
  deleteUser, 
  findUserbyId, 
  createUser, 
  updateUser 
};
