const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { orderOne, orderTwo } = require('./order.fixture');
const { productOne, productTwo } = require('./product.fixture');

const orderItemOne = {
  id: v4(),
  orderId: orderOne.id,
  productId: productOne.id,
  quantity: faker.datatype.number({ min: 1, max: 100 }),
  unitPrice: faker.datatype.float({ min: 10, max: 500, precision: 0.1 }),
};

const orderItemTwo = {
  id: v4(),
  orderId: orderTwo.id,
  productId: productTwo.id,
  quantity: faker.datatype.number({ min: 1, max: 100 }),
  unitPrice: faker.datatype.float({ min: 10, max: 500, precision: 0.1 }),
};

async function insertOrderItems(orderItems) {
  orderItems = orderItems.map((item) => ({ ...item }));
  await prisma.orderItem.createMany({
    data: orderItems,
  });
}

module.exports = { orderItemOne, orderItemTwo, insertOrderItems };
