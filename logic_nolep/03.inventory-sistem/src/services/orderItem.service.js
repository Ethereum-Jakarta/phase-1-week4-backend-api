import { prisma } from '../../lib/prisma.js';

class OrderItemService {
  static async create(data) {
    return await prisma.orderItem.create({ data });
  }

  static async update(id, data) {
    return await prisma.orderItem.update({
      where: {
        id: id,
      },
      data,
    });
  }

  static async hardDelete(id) {
    return await prisma.orderItem.delete({
      where: {
        id: id,
      },
    });
  }

  static async getAll() {
    return await prisma.orderItem.findMany({});
  }

  static async findByID(id) {
    return await prisma.orderItem.findUnique({
      where: {
        id: id,
      },
    });
  }

  static async findByOrder(orderId) {
    return await prisma.orderItem.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        order: {
          select: {
            customerName: true,
            customerEmail: true,
          },
        },
      },
    });
  }
}

export default OrderItemService;
