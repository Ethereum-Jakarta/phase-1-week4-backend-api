const prisma = require('../../prisma/client');

class Todo {
    constructor(title, description, status, userId) {
        this.title = title,
            this.description = description,
            this.status = status,
            this.userId = userId
    }

    static async create(title, description, status, userId) {
        try {
            let exist = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
            if (!exist) throw new Error('User not found!');

            let newTodo = new Todo(title, description, status, userId);
            let result = await prisma.todo.create({
                data: {
                    title: newTodo.title,
                    description: newTodo.description,
                    status: newTodo.status,
                    userId: newTodo.userId
                }
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    static async getTodo() {
        try {
            let result = await prisma.todo.findMany();
            return result;
        } catch (error) {
            return error;
        }
    }

    static async update(id, title, description, status, userId) {
        try {
            let exist = await prisma.todo.findUnique({ where: { id: parseInt(id) } });
            if (!exist) throw new Error('User not found!');

            let updateTodo = new Todo(title, description, status, userId);
            let result = await prisma.todo.update({
                where: { id: parseInt(id) },
                data: {
                    title: updateTodo.title,
                    description: updateTodo.description,
                    status: updateTodo.status,
                    userId: updateTodo.userId
                }
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    static async delete(id) {
        try {
            let exist = await prisma.todo.findUnique({ where: { id: parseInt(id) } });
            if (!exist) throw new Error('User not found!');

            let result = await prisma.todo.delete({ where: { id: parseInt(id) } });
            return result;
        } catch (error) {
            return error;
        }
    }
}

module.exports = Todo;