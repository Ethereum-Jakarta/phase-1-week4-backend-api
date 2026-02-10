const { PrismaClient } = require('./generated/client');

const prisma = new PrismaClient();

module.exports = prisma;
