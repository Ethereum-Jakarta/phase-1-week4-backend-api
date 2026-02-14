const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');
const { orderService, productService } = require('./index');

const createOrderItem = async (data) => {
  // check if order exists and get data
  const order = await orderService.getOrderById(data.orderId);

  // check if product exists and get quantity data
  const product = await productService.getProductById(data.productId);
  // check quantity of product
  if (product.quantityInStock < data.quantity) throw new ApiError(httpStatus.BAD_REQUEST, 'Quantity not enough');

  // create order item
  const orderItem = await prisma.orderItem.create({
    data: {
      orderId: data.orderId,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: product.price,
    },
  });

  // update order total price
  await orderService.updateOrderById(order.id, {
    totalPrice: product.price * orderItem.quantity + order.totalPrice,
  });

  // update product quantity
  await productService.updateProductById(product.id, {
    quantityInStock: product.quantityInStock - orderItem.quantity,
  });

  return orderItem;
};

const queryOrderItems = async (filter, options) => {
  const { quantity } = filter;
  const { take, skip, sort: orderBy } = options;

  const orderItems = await prisma.orderItem.findMany({
    where: {
      quantity: {
        lte: quantity,
      },
    },
    include: {
      order: true,
      product: true,
    },
    orderBy,
    skip,
    take: Number(take),
  });

  if (orderItems.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order item not found');
  }

  return orderItems;
};

const getOrderItemById = async (id) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: {
      id,
    },
    include: {
      order: true,
      product: true,
    },
  });
  if (!orderItem) throw new ApiError(httpStatus.NOT_FOUND, 'Order item not found');

  return orderItem;
};

const updateOrderItemById = async (orderItemId, data) => {
  // check if order exists and get data
  const order = await orderService.getOrderById(data.orderId);
  // check if product exists and get quantity data
  const product = await productService.getProductById(data.productId);
  if (product.quantityInStock < data.quantity) throw new ApiError(httpStatus.BAD_REQUEST, 'Quantity not enough');
  // get old older item
  const oldOrderItem = await getOrderItemById(orderItemId);

  const updatedOrderItem = await prisma.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: {
      orderId: data.orderId,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: product.price,
    },
  });

  const totalPriceDifference =
    updatedOrderItem.unitPrice * updatedOrderItem.quantity - oldOrderItem.unitPrice * oldOrderItem.quantity;

  // update order total price
  await orderService.updateOrderById(order.id, {
    totalPrice: order.totalPrice + totalPriceDifference,
  });

  const quantityDifference = updatedOrderItem.quantity - oldOrderItem.quantity;

  // Update product quantity
  if (quantityDifference > 0) {
    await productService.updateProductById(product.id, {
      quantityInStock: product.quantityInStock - quantityDifference,
    });
  } else if (quantityDifference < 0) {
    await productService.updateProductById(product.id, {
      quantityInStock: product.quantityInStock + Math.abs(quantityDifference),
    });
  }

  return updatedOrderItem;
};

const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);

  // check if order exists and get data
  const order = await orderService.getOrderById(orderItem.orderId);
  // check if product exists and get quantity data
  const product = await productService.getProductById(orderItem.productId);

  const deletedOrderItem = await prisma.orderItem.delete({
    where: {
      id: orderItemId,
    },
  });

  // update order total price
  await orderService.updateOrderById(order.id, {
    totalPrice: order.totalPrice - orderItem.unitPrice * orderItem.quantity,
  });

  // update product quantity
  await productService.updateProductById(product.id, {
    quantityInStock: product.quantityInStock + orderItem.quantity,
  });

  return deletedOrderItem;
};

const getOrderItemsByOrderId = async (orderId) => {
  const orders = await prisma.orderItem.findMany({
    where: {
      orderId,
    },
    include: {
      order: true,
      product: true,
    },
  });

  if (orders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order item not found');
  }

  return orders;
};

module.exports = {
  createOrderItem,
  queryOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
  getOrderItemsByOrderId,
};
