const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const User = {
  create: async (data) => {
    return prisma.user.create({ data });
  },

  findAll: async () => {
    return prisma.user.findMany();
  },

  findById: async (id) => {
    return prisma.user.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.user.update({ where: { id }, data });
  },

  delete: async (id) => {
    return prisma.user.delete({ where: { id } });
  },
};

module.exports = User;
