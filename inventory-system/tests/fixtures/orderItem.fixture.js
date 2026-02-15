const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { orderOne } = require('./order.fixture');
const { productOne } = require('./product.fixture');

const orderItemOne = {
  id: v4(),
  orderId: orderOne.id,
  productId: productOne.id,
  quantity: faker.datatype.number({ min: 1, max: 4 }),
  unitPrice: productOne.price
};

const insertOrderItems = async (orderItems) => {
  orderItems = orderItems.map((orderItem) => ({ ...orderItem }));
  await prisma.orderItem.createMany({
    data: orderItems,
    skipDuplicates: true,
  });
};

const deleteOrderItems = async () => {
  await prisma.orderItem.deleteMany({});
};

module.exports = {
  orderItemOne,
  insertOrderItems,
  deleteOrderItems,
};
