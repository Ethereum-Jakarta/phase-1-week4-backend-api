const prisma = require('./src/config/db');

async function resetDatabase() {
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.$executeRaw`ALTER TABLE OrderItem AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE \`Order\` AUTO_INCREMENT = 1`;  // Gunakan backtick pada `Order` karena "Order" adalah kata kunci SQL
  await prisma.$executeRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 1`;

  console.log('Database has been reset and auto-increment values have been reset.');
}

resetDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

