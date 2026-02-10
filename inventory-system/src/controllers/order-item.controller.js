const httpStatus = require('http-status');
const { orderItemService } = require('../service/index');
const catchAsync = require('../utils/catchAsync');

const createOrderItem = catchAsync(async (req, res) => {
  const result = await orderItemService.createOrderItem(req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Create Order Item Success',
    data: result,
  });
});

const getOrderItem = catchAsync(async (req, res) => {
  const filter = {
    gt: parseInt(req.query.quantityGreaterThan, 10) || undefined,
    lt: parseInt(req.query.quantityLowerThan, 10) || undefined,
  };
  const option = {
    skip: parseInt(req.query.skip, 10) || 0,
    take: parseInt(req.query.take, 10) || 10,
  };
  const result = await orderItemService.getOrderItem(filter, option);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Get Order Item Success',
    data: result,
  });
});

const getOrderItemById = catchAsync(async (req, res) => {
  const result = await orderItemService.getOrderItemById(req.params.orderItemId);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Get Order Item By Id Success',
    data: result,
  });
});

const updateOrderItem = catchAsync(async (req, res) => {
  const result = await orderItemService.updateOrderItem(req.params.orderItemId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Update Order Item By Id Success',
    data: result,
  });
});

const deleteOrderItem = catchAsync(async (req, res) => {
  const result = await orderItemService.deleteOrderItem(req.params.orderItemId);

  res.status(httpStatus.OK).send({
    status: httpStatus.CREATED,
    message: 'Delete Order Item By Id Success',
    data: result,
  });
});

module.exports = {
  createOrderItem,
  getOrderItem,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};
