const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderItemService,orderService,productService } = require('../services');

const createOrderItem = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.body.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const product = await productService.getProductById(req.body.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  } else if(product.quantityInStock<req.body.quantity){
    throw new ApiError(httpStatus.NOT_FOUND, 'Insufficient product stock');
  }

  const orderItem = await orderItemService.createOrderItem(req.body,req.user.id);
  await productService.updateQuantityProduct(req.body.productId,-orderItem.quantity);
  await orderService.updateTotalPrice(req.body.orderId,orderItem.quantity*orderItem.unitPrice);
  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Create OrderItem Success",
    data: orderItem
  });
});

const getOrderItems = catchAsync(async (req, res) => {
  var page = 1;
  var take = 5;
  var skip = (page-1)*take;
  const result = await orderItemService.queryOrderItems(skip,take);
  
  res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: "Get OrderItems Success",
      data: result
    });
  });
const getOrderItemsByUser = catchAsync(async (req, res) => {
  const result = await orderItemService.queryOrderItemsByUserId(req.user.id);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get OrderItems Success",
    data: result
  });
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found');
  }
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get OrderItem Success",
    data: orderItem
  });
});

const updateOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found');
  }
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  // req.body.userId = req.user.id;
  const orderItemNew = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);
  await productService.updateQuantityProduct(orderItem.productId,orderItem.quantity);
  await productService.updateQuantityProduct(orderItemNew.productId,-orderItemNew.quantity);
  await orderService.updateTotalPrice(orderItem.orderId,-orderItem.quantity*orderItem.unitPrice);
  await orderService.updateTotalPrice(orderItemNew.orderId,orderItemNew.quantity*orderItemNew.unitPrice);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Update OrderItem Success",
    data: orderItemNew
  });
});

const deleteOrderItem = catchAsync(async (req, res) => {
  const deletedOrderItem = await orderItemService.deleteOrderItemById(req.params.orderItemId);
  await productService.updateQuantityProduct(deletedOrderItem.productId,deletedOrderItem.quantity);
  await orderService.updateTotalPrice(deletedOrderItem.orderId,-deletedOrderItem.quantity*deletedOrderItem.unitPrice);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Delete OrderItem Success",
    data: null
  });
});

module.exports = {
  createOrderItem,
  getOrderItems,
  getOrderItemsByUser,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};