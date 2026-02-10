const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

const createOrderItem = async (orderItemBody) => {
  const { productId, quantity } = orderItemBody;

  const product = await prisma.product.findFirst({
    where: { id: productId },
  });

  if (quantity > product.quantityInStock) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock for the selected product');
  }

  const result = await prisma.orderItem.create({
    data: orderItemBody,
  });

  const newQuantity = product.quantityInStock - quantity;
  await prisma.product.update({
    where: { id: productId },
    data: { quantityInStock: newQuantity },
  });

  return result;
};

const getOrderItem = async (quantity, option) => {
  const result = await prisma.orderItem.findMany({
    where: { quantity },
    ...option,
  });
  return result;
};

const getOrderItemById = async (orderItemId) => {
  const result = await prisma.orderItem.findFirst({
    where: { id: orderItemId },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item Not Found');
  }

  return result;
};

const updateOrderItem = async (orderItemId, orderItemBody) => {
  const target = await getOrderItemById(orderItemId);
  const result = await prisma.orderItem.update({
    where: { id: orderItemId },
    data: orderItemBody,
  });
  return result;
};

const deleteOrderItem = async (orderItemId) => {
  const target = await getOrderItemById(orderItemId);
  const result = await prisma.orderItem.delete({
    where: { id: orderItemId },
  });

  return result;
};

module.exports = {
  createOrderItem,
  getOrderItem,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};
