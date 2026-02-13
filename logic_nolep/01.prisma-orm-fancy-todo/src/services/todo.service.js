import { prisma } from "../../lib/prisma.js"

class Todo {
    static async create(data) {
        return await prisma.todo.create({
            data
        })
    }

    static async update(id, title, description, status) {
        return await prisma.todo.update({
            where : {
                id : id
            },
            data : {
                title, description, status
            }
        })
    }

    static async delete(id) {
        return await prisma.todo.delete({
            where : {
                id: id
            }
        })
    }

    static async show() {
        return await prisma.todo.findMany()
    }

    static async find(id) {
        return await prisma.todo.findUnique({
            where : {
                id : Number(id)
            }
        })
    }
}

export default Todo