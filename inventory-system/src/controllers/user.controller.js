const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { userService } = require('../services')
const catchAsync = require('../utils/catchAsync')

const getAllUsers = catchAsync(async (req, res) => {
  const { skip, limit } = req.query

  const responsed = await userService.getAllUsers(skip, limit);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get Users Succesfully",
    totalPage: responsed.totalPage,
    totalData: responsed.totalData,
    data: responsed.data,
  })
})

const getUser = catchAsync(async (req, res) => {
  const userId = req.params.userId

  const data = await userService.getUser(userId)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get User Succesfully",
    data
  })
})

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const userBody = req.body

  const data = await userService.updateUser(userId, userBody)

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: "Update User Succesfully",
    data
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId

  const existingUser = await userService.getUser(userId)

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await userService.deleteUser(userId)

  res.status(204).json(null)
})

const createUser = catchAsync(async (req, res) => {
  const userBody = req.body;

  const data = await userService.createUser(userBody)

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: "Create User Successfully",
    data,
  })
})

const getProductsByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId

  const data = await userService.getProductsByUser(userId)

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get Products Succesfully",
    data
  })
})

const getOrdersByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId

  const data = await userService.getOrdersByUser(userId)

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get Orders Succesfully",
    data
  })
})

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  getProductsByUser,
  getOrdersByUser
}
