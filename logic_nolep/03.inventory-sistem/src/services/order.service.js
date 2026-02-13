import { prisma } from '../../lib/prisma.js';

class OrderService {
  static async create(data) {
    return await prisma.order.create({ data });
  }

  static async update(id, data) {
    return await prisma.order.update({
      where: {
        id: id,
      },
      data,
    });
  }

  static async hardDelete(id) {
    return await prisma.order.delete({
      where: {
        id: id,
      },
    });
  }

  static async softDelete(id) {
    return await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }

  static async getAll() {
    return await prisma.order.findMany({
      where: {
        isActive: true,
      },
    });
  }

  static async findByID(id) {
    return await prisma.order.findFirst({
      where: {
        id: id,
        isActive: true,
      },
    });
  }

  static async findByUser(userId) {
    return await prisma.order.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}

export default OrderService;
