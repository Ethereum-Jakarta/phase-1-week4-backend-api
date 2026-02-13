const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const userService  = require('../service/user.service');
const ApiError = require('../../utils/ApiError');

const getUsers = catchAsync(async (req, res) => {
  const user = await userService.getAllUsers();
  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Internal Server Error!')
  }
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get All Users Success!',
    data: user
  })
})

const getUser = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Users by id success!',
    data: user
  })
});
 
const createUser = catchAsync(async (req, res) => {
  const {name, email, password, role} = req.body
  const user = await userService.createUser(name, email, password, role)
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Create User Success!',
    data: user
  })
})

const updateUser = catchAsync(async (req, res) => {
  const userBody = req.body
  const userid = req.params.userId
  const user = await userService.updateUser(userid,userBody) 
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update User Success!',
    data: user
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const userid = req.params.userId
  const user = await userService.deleteUser(userid)
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete User Success!',
    data: user
  })
})

const getProductByUser = catchAsync(async (req, res) => {
  const userid = req.params.userId
  const result = await userService.getProductByUser(userid)
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product User Success!',
    data: result
  })
})

const getOrderByUser = catchAsync(async (req, res) => {
  const userid = req.params.userId
  const result = await userService.getProductByUser(userid)
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order User Success!',
    data: result
  })
})
module.exports = { getUser, getUsers, createUser, updateUser, deleteUser, getProductByUser, getOrderByUser };