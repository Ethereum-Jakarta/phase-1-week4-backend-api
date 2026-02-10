const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const orderItemsService = require('./orderItem.service');

/**
 * Get Order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
async function getOrderById(id) {
  return prisma.order.findFirst({
    where: {
      id,
    },
  });
}

/**
 * Create a Order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
async function createOrder(orderBody) {
  const order = await prisma.order.create({
    data: orderBody,
    include: {
      orderItems: true,
    },
  });

  for (const item of order.orderItems) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    if (product.quantityInStock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock for the product');
    }

    await prisma.product.update({
      where: {
        id: item.productId,
      },
      data: {
        quantityInStock: product.quantityInStock - item.quantity,
      },
    });
  }

  return order;
}

/**
 * Update Order by id
 * @param {ObjectId} Orderid
 * @param {ObjectId} Userid
 * @param {Object} updateBody
 * @returns {Promise<Ordery>}
 */
async function updateOrder(Orderid, updateBody) {
  const order = await getOrderById(Orderid);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const updatedOrder = await prisma.order.update({
    where: {
      id: Orderid,
    },
    data: updateBody,
  });
  return updatedOrder;
}

/**
 * Get All Orders
 * @returns {Promise<Order>}
 */
async function getOrder(options) {
  const data = prisma.order.findMany({
    take: +options.take || 5,
    skip: +options.skip || 0,
  });
  return data;
}

/**
 * Delete Order by id
 * @param {ObjectId} Orderid
 * @returns {Promise<Order>}
 */
async function deleteOrder(Orderid) {
  const order = await getOrderById(Orderid);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const deletedOrder = await prisma.order.deleteMany({
    where: {
      id: Orderid,
    },
  });
  return deletedOrder;
}

/**
 * Get Order by user
 * @param {ObjectId} userId
 * @returns {Promise<Order>}
 */
async function getOrderbyUser(userId) {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const orders = await prisma.order.findMany({
    where: { userId: userId },
  });

  return orders;
}

module.exports = {
  getOrder,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder,
  getOrderbyUser,
};
