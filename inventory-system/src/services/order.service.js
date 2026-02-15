const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

const create = async (orderBody) => {
  const user = await prisma.user.findFirst({
    where: {
      id: orderBody.userId,
    },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'userId not found');

  return prisma.orders.create({
    data: orderBody,
  });
};

const getAll = async (filter, options, sorting) => {
  return prisma.orders.findMany({
    ...options,
    where: filter,
    orderBy: sorting,
  });
};

const getId = async (id) => {
  return prisma.orders.findFirst({
    where: {
      id: id,
    },
  });
};

const update = async (id, update) => {
  const order = await getId(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const updateOrder = await prisma.orders.update({
    where: {
      id: id,
    },
    data: update,
  });

  return updateOrder;
};

const deleted = async (id) => {
  const order = await getId(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const deleteOrder = await prisma.orders.delete({
    where: {
      id: id,
    },
  });

  return deleteOrder;
};

module.exports = { create, getAll, getId, update, deleted };
