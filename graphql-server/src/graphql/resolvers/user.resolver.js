const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const User = {
    users: async () => {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (error) {
            throw error;
        }
    },
    createUser: async args => {
        try {
            const { name, username, email } = args.input;

            if (!name) throw new Error("name required");
            if (!username) throw new Error("username required");
            if (!email) throw new Error("email required");

            const newUser = await prisma.user.create({
                data: {
                    name,
                    username,
                    email
                }
            })

            return newUser
        } catch (error) {
            throw error
        }
    }
}

module.exports = User