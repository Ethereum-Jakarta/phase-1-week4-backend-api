const prisma = require('../../prisma/client');

class User {
    constructor(name, email, phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    static async create(name, email, phone) {
        try {
            let newUser = new User(name, email, phone);
            let result = await prisma.user.create({
                data: {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone
                }
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    static async getUser() {
        try {
            let result = await prisma.user.findMany();
            return result;
        } catch (error) {
            return error;
        }
    }

    static async update(id, name, email, phone) {
        try {
            let exist = await prisma.user.findUnique({ where: { id: parseInt(id) } });
            if (!exist) throw new Error('User not found');

            let updateUser = new User(name, email, phone);
            let result = await prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    name: updateUser.name,
                    email: updateUser.email,
                    phone: updateUser.phone
                }
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    static async delete(id) {
        try {
            let exist = await prisma.user.findUnique({ where: { id: parseInt(id) }, });
            if (!exist) throw new Error('User not found');

            let result = await prisma.user.delete({ where: { id: parseInt(id) }, });
            return result;
        } catch (error) {
            return error;
        }
    }
}

module.exports = User;