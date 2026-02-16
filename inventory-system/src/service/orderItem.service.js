const httpStatus = require('http-status');
const { prisma } = require('../../prisma');
const ApiError = require('../utils/ApiError');
const productService = require('./product.service');
const orderService = require('./order.service');

const createOrderItem = async (orderId, productId, quantity, unitPrice) => {
  const product = await productService.getProductById(productId);

  if (!product) {
    // Produk tidak ditemukan
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (product.quantityInStock < quantity) {
    // Stok tidak mencukupi
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock');
  }

  // update totalPrice di Order
  const order = await orderService.getOrderById(orderId);
  order.totalPrice += unitPrice * quantity;
  await orderService.updateOrderById(orderId, order);

  // update quantityInStock di Product
  product.quantityInStock -= quantity;
  await productService.updateProductById(productId, product);

  return prisma.orderItem.create({
    data: {
      orderId,
      productId,
      quantity,
      unitPrice,
    },
  });
};

const getAllOrderItems = async (pageSize, skip) => {
  const orderItems = await prisma.orderItem.findMany({
    skip,
    take: pageSize,
  });
  return orderItems;
};

const getOrderItemById = async (id) => {
  return prisma.orderItem.findFirst({
    where: { id },
  });
};

const updateOrderItemById = async (orderItemId, updateBody) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found');
  }

  const updateOrderItem = await prisma.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: updateBody,
  });

  return updateOrderItem;
};

const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'orderItem not found');
  }

  const deleteOrderItems = await prisma.orderItem.deleteMany({
    where: {
      id: orderItemId,
    },
  });

  return deleteOrderItems;
};

// const getOrderItemsbyOrder =

module.exports = {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
};
