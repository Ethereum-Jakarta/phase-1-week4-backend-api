import { prisma } from "../../lib/prisma.js";

class Users {
    static async create(data) {
        return await prisma.user.create({data});
    }

    static async update(id, data) {
        return await prisma.user.update({
            data,
            where: {
                id: Number(id)
            }
        })
    }

    static async delete(id) {
        return await prisma.user.delete({
            where: {
                id: Number(id)
            }
        })
    }

    static async show() {
        return await prisma.user.findMany()
    }

    static async find(id) {
        return await prisma.user.findUnique({
            where : {
                id : Number(id)
            }
        })
    }
}

export default Users;