const { v4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const prisma = require('../../prisma/client');
const { orderOne } = require('./order.fixture');
const { productOne } = require('./product.fixture');

const orderItemOne = {
  id: v4(),
  orderId: orderOne.id,
  productId: productOne.id,
  quantity: faker.number.int({ min: 1, max: 100 }),
  unitPrice: faker.number.float({ min: 10, max: 1000 }),
};

const insertOrderItems = async (orderItem) => {
  await prisma.orderItem.createMany({
    data: orderItem,
    skipDuplicates: true,
  });
};

module.exports = {
  orderItemOne,
  insertOrderItems,
};
