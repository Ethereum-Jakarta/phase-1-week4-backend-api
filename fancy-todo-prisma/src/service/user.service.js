const prisma = require('../../prisma/client')

const showUsers = async () => {
    const result = await prisma.user.findMany()
    return result
}

const getUserById = async (id) => {
    const result = await prisma.user.findUnique({
        where: {
            id 
        }
    })

    return result
}

const createUser = async (name, email, phone) => {
    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone
        }
    })

    return user
}

const updateUser = async (id, name, email, phone) => {
    const result = await prisma.user.update({
        where:{
            id
        },
        data: {
            name,
            email,
            phone
        }
    })

    return result
}

const deleteUser = async (id) => {
    const result = await prisma.user.delete({
        where:{
            id
        }
    })

    return result
}


module.exports = {createUser, showUsers, getUserById, updateUser, deleteUser}