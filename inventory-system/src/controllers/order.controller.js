const httpStatus = require('http-status');
const { orderService } = require('../service/index');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
  const result = await orderService.createOrder(req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Create Order Success',
    data: result,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const filter = {
    totalPrice: parseInt(req.query.totalPrice, 10) || undefined,
  };
  const option = {
    skip: parseInt(req.query.skip, 10) || 0,
    take: parseInt(req.query.take, 10) || 10,
  };
  const result = await orderService.getProduct(filter, option);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Get Order Success',
    data: result,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const result = await orderService.getOrderById(req.params.orderId);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Get Order By Id Success',
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const result = await orderService.updateOrder(req.params.orderId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Update Order Success',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const result = await orderService.deleteOrder(req.params.orderId);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Delete Order Success',
    data: result,
  });
});
module.exports = {
  createOrder,
  getProduct,
  getOrderById,
  updateOrder,
  deleteOrder,
};
