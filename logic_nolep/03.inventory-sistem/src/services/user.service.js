import { prisma } from '../../lib/prisma.js';

class UserService {
  static async create(data) {
    return await prisma.user.create({ data });
  }

  static async update(id, data) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data,
    });
  }

  static async hardDelete(id) {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  static async softDelete(id) {
    return await prisma.user.update({
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
    return await prisma.user.findMany({
      where: {
        isActive: true,
      },
    });
  }

  static async findByID(id) {
    return await prisma.user.findFirst({
      where: {
        id: id,
        isActive: true,
      },
    });
  }
}

export default UserService;
