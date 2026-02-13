import { prisma } from '../../lib/prisma.js';

class ProductService {
  static async create(data) {
    return await prisma.product.create({ data });
  }

  static async update(id, data) {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data,
    });
  }

  static async hardDelete(id) {
    return await prisma.product.delete({
      where: {
        id: id,
      },
    });
  }

  static async softDelete(id) {
    return await prisma.product.update({
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
    return await prisma.product.findMany({
      where: {
        isActive: true,
      },
    });
  }

  static async findByID(id) {
    return await prisma.product.findFirst({
      where: {
        id: id,
        isActive: true,
      },
    });
  }

  static async findByUser(userId) {
    return await prisma.product.findMany({
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

export default ProductService;
