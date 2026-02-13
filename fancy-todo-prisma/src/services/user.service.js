const prisma = require('../../prisma/client')

const getUsers =  async() => {
    const user = await prisma.user.findMany();
    return user;
}

const getUser = async(id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    return user
}

const createUser = async(name, email, phone) => {
    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone
        }
    })
    return user
}

const updateUser = async(id, name, email, phone) => {
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            name,
            email,
            phone
        }
    })
    return user
}

const deleteUser = async(id) => {
    const user = await prisma.user.delete({
        where: {
            id
        }
    })
    return user
}

module.exports = {getUsers, getUser, createUser, updateUser, deleteUser}