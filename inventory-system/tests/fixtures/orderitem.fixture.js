const prisma = require('../../prisma');

const insertOrderItems = async (orderItems) => {
  try {
    await prisma.orderItem.createMany({
      data: orderItems,
      skipDuplicates: true,
    });
  } catch (error) {
    console.info('[ERROR_INSERT_ORDER_ITEMS]', error);
  }
};

module.exports = {
  insertOrderItems,
};
