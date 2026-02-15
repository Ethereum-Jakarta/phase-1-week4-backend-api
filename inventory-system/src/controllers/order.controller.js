const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService, orderItemService } = require('../services');


const getAllOrders = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await orderService.getAllOrders(page, limit);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Orders Success',
    data: result.orders,
    pagination: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    },
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order Not Found');
  }

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Order Success',
    data: order,
  });
});

const createOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const orderData = {
    ...req.body,
    userId, 
  };

  const createdOrder = await orderService.createOrder(orderData);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Order created successfully',
    data: createdOrder,
  });
});


const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update Order Success',
    data: order,
  });
});


const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete Order Success',
    data: null,
  });
});

const getOrderItemsByOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const orderItems = await orderItemService.getOrderItemsByOrder(orderId);
  if (!orderItems.length) {
    throw new ApiError(status.NOT_FOUND, 'No order items found for this order id');
  }

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Order Items By Order Success',
    data: orderItems,
  });
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderItemsByOrder
}