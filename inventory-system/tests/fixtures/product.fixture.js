const prisma = require('../../prisma');

const insertProducts = async (products) => {
  try {
    await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });
  } catch (error) {
    console.info("[ERROR_INSERT_PRODUCT]", error)
  }
};

module.exports = {
  insertProducts
};
