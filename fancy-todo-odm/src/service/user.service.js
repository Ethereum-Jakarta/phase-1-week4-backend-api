const prisma = require("../../prisma/client") 

const getUsers = async () => {
    const result = await prisma.user.findMany();
    return result;
}
const findUser = async (userId) => {
    const result = await prisma.user.findUnique({
        where: {id:userId}
    });
    return result;
}
const createUser = async (userBody) => {
    const result = await prisma.user.create({
        data:userBody
    });
    return result;
}
const updateUser = async (userBody,userId) => {
    const result = await prisma.user.update({
        where: {id:userId},
        data:userBody
    });
    return result;
}
const deleteUser = async (userId) => {
    const result = await prisma.user.delete({
        where: {id:userId}
    });
    return result;
}



module.exports = {
    getUsers,
    findUser,
    createUser,
    updateUser,
    deleteUser
}