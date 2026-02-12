const prisma = require('../../prisma');

const insertOrders = async (orders) => {
  try {
    await prisma.order.createMany({
      data: orders,
      skipDuplicates: true,
    });
  } catch (error) {
    console.info('[ERROR_INSERT_ORDERS]', error);
  }
};

module.exports = {
  insertOrders,
};
