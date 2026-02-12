const { orderItemService } = require('../services')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')

const getAllOrderItems = catchAsync(async (req, res) => {
  const { skip, limit } = req.query

  const responsed = await orderItemService.getAllOrderItems(skip, limit)

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get OrderItems Succesfully",
    totalPage: responsed.totalPage,
    totalData: responsed.totalData,
    data: responsed.data
  })
})

const getOrderItem = catchAsync(async (req, res) => {
  const orderItemId = req.params.orderItemId

  const data = await orderItemService.getOrderItem(orderItemId)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "OrderItem not found")
  }

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get OrderItem Succesfully",
    data
  })
})

const deleteOrderItem = catchAsync(async (req, res) => {
  const orderItemId = req.params.orderItemId

  const existingOrderItem = await orderItemService.getOrderItem(orderItemId)
  if (!existingOrderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "OrderItem not found")
  }

  await orderItemService.deleteOrderItem(orderItemId)

  res.status(204).json(null)
})

const updateOrderItem = catchAsync(async (req, res) => {
  const orderItemId = req.params.orderItemId
  const orderItemBody = req.body

  const data = await orderItemService.updateOrderItem(orderItemId, orderItemBody)

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: "Update OrderItem Succesfully",
    data
  })
})

const createOrderItem = catchAsync(async (req, res) =>  {
  const orderItemBody = req.body

  const data = await orderItemService.createOrderItem(orderItemBody)

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: "Create OrderItem Succesfully",
    data
  })
})

module.exports = {
  getAllOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem
}
