import { prisma } from '../../lib/prisma.js';

class CategoryService {
  static async create(data) {
    return await prisma.category.create({ data });
  }

  static async update(id, data) {
    return await prisma.category.update({
      where: {
        id: id,
      },
      data,
    });
  }

  static async hardDelete(id) {
    return await prisma.category.delete({
      where: {
        id: id,
      },
    });
  }

  static async softDelete(id) {
    return await prisma.category.update({
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
    return await prisma.category.findMany({
      where: {
        isActive: true,
      },
    });
  }

  static async findByID(id) {
    return await prisma.category.findFirst({
      where: {
        id: id,
        isActive: true,
      },
    });
  }
}

export default CategoryService;
