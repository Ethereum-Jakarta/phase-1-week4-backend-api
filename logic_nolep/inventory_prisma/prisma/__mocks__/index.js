const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { join } = require('path');

const generateDatabaseURL = () => {
  if (!process.env.DATABASE_URL_TESTING) {
    throw new Error('please provide a database url');
  }
  let url = process.env.DATABASE_URL_TESTING;

  return url;
};

const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma');

let url = generateDatabaseURL();

const prisma = new PrismaClient({
  datasources: { db: { url } },
});

beforeAll(async () => {
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: url,
    },
  });
});

beforeEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.token.deleteMany();
  await prisma.category.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
