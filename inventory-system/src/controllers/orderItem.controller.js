const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const orderItemService  = require('../services');


const getAllOrderItems = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await orderItemService.getAllOrderItems(page, limit);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Order Items Success',
    data: result.orderItems,
    pagination: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    },
  });
});



const getOrderItemById = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(status.NOT_FOUND, 'Order Item Not Found');
  }

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Order Item Success',
    data: orderItem,
  });
});


const updateOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update Order Item Success',
    data: orderItem,
  });
});

const deleteOrderItem = catchAsync(async (req, res) => {
  await orderItemService.deleteOrderItemById(req.params.orderItemId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete Order Item Success',
    data: null,
  });
});

module.exports = {
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem
}