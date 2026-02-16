const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const orderItemService = require('../service/orderItem.service');
const productService = require('../service/product.service');

const createOrderItem = catchAsync(async (req, res) => {
  const { orderId, productId, quantity } = req.body;
  const product = await productService.getProductById(productId);

  // harga perProduct
  const unitPrice = product.price;
  const orderItem = await orderItemService.createOrderItem(orderId, productId, quantity, unitPrice);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create OrderItem Success',
    data: orderItem,
  });
});

const getAllOrderItems = catchAsync(async (req, res) => {
  const { page, size } = req.query;

  // Konversi ke bilangan bulat (integer)
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(size, 10);

  if (Number.isNaN(pageNumber) || Number.isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
    throw new Error('Invalid page or size parameters');
  }

  // Hitung berapa data yang perlu dilewati (skip)
  const skip = (pageNumber - 1) * pageSize;

  const result = await orderItemService.getAllOrderItems(pageSize, skip);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get OrderItems Success',
    data: result,
  });
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get OrderItem Success',
    data: orderItem,
  });
});

const updateOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update OrderItem Success',
    data: orderItem,
  });
});

const deleteOrderItem = catchAsync(async (req, res) => {
  await orderItemService.deleteOrderItemById(req.params.orderItemId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete OrderItem Success',
    data: null,
  });
});

module.exports = {
  createOrderItem,
  getAllOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
