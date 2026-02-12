const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

const getAllOrderItems = async (skip = 0, limit = 10) => {
  const result = await prisma.orderItem.findMany({
    take: parseInt(limit),
    skip: parseInt(skip),
  });

  const resultCount = await prisma.orderItem.count({ skip: parseInt(skip) });
  const totalPage = Math.ceil(resultCount / limit);

  return { totalPage, totalData: resultCount, data: result };
};

const getOrderItem = async (orderItemId) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
  });

  return orderItem;
};

const deleteOrderItem = async (orderItemId) => {
  /**
   * @currentOrderItem & @currentOrder
   */
  const currentOrderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      product: true,
    },
  });

  const currentOrder = await prisma.order.findUnique({
    where: { id: currentOrderItem.orderId },
  });

  /**
   * @validation
   */
  if (!currentOrderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'orderItem not found');
  }

  if (!currentOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }

  /**
   * @updateTotalPrice
   */
  const totalPriceCurrentOrderItem = currentOrderItem.unitPrice * currentOrderItem.quantity;
  let totalPrice = currentOrder.totalPrice - totalPriceCurrentOrderItem;

  await prisma.order.update({
    where: { id: currentOrder.id },
    data: {
      totalPrice,
    },
  });

  /**
   * @deleteOrderItemData
   */
  const deleteOrderItemData = await prisma.orderItem.delete({
    where: { id: orderItemId },
  });

  return deleteOrderItemData;
};

const updateOrderItem = async (orderItemId, orderItemBody) => {
  /**
   * @currentOrderItem & @currentOrder
   */
  const currentOrderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      product: true,
    },
  });

  const currentOrder = await prisma.order.findUnique({
    where: { id: orderItemBody.orderId },
  });

  /**
   * @validation
   */
  if (!currentOrderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'orderItem not found');
  }

  if (!currentOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }

  /**
   * @updateProductQuantity
   */
  const quantityChange = orderItemBody.quantity - currentOrderItem.quantity;

  if (quantityChange > currentOrderItem.product.quantityInStock) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock');
  }

  await prisma.product.update({
    where: { id: currentOrderItem.product.id },
    data: {
      quantityInStock: currentOrderItem.product.quantityInStock - quantityChange,
    },
  });

  /**
   * @updateTotalPrice
   */
  const totalPriceCurrentOrderItem = currentOrderItem.unitPrice * currentOrderItem.quantity;
  const totalPriceProduct = currentOrderItem.unitPrice * orderItemBody.quantity;

  let totalPrice = currentOrder.totalPrice - totalPriceCurrentOrderItem;
  totalPrice += totalPriceProduct;

  await prisma.order.update({
    where: { id: orderItemBody.orderId },
    data: {
      totalPrice,
    },
  });

  /**
   * @updateOrderItem
   */
  const updatedOrderItem = await prisma.orderItem.update({
    where: { id: orderItemId },
    data: orderItemBody,
  });

  return updatedOrderItem;
};

const createOrderItem = async (orderItemBody) => {
  /**
   * @currentProduct & @currentOrder
   */
  const currentProduct = await prisma.product.findUnique({
    where: { id: orderItemBody.productId },
  });

  const currentOrder = await prisma.order.findUnique({
    where: { id: orderItemBody.orderId },
  });

  /**
   * @validation
   */
  if (!currentProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }

  if (!currentOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }

  /**
   * @updateProductQuantity
   */
  if (orderItemBody.quantity > currentProduct.quantityInStock) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock');
  }

  await prisma.product.update({
    where: { id: currentProduct.id },
    data: {
      quantityInStock: currentProduct.quantityInStock - orderItemBody.quantity,
    },
  });

  /**
   * @updateTotalPrice
   */
  const totalPriceProduct = currentProduct.price * orderItemBody.quantity;
  const totalPrice = totalPriceProduct + currentOrder.totalPrice;

  await prisma.order.update({
    where: { id: orderItemBody.orderId },
    data: {
      totalPrice,
    },
  });

  /**
   * @newOrderItem
   */
  const newOrderItem = await prisma.orderItem.create({
    data: orderItemBody,
  });

  return newOrderItem;
};

module.exports = {
  getAllOrderItems,
  getOrderItem,
  deleteOrderItem,
  updateOrderItem,
  createOrderItem,
};
