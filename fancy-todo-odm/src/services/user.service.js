const userModel = require('../models/user.model')
const todoModel = require('../models/todo.model')

const getUsers = async () => {
    const user = await userModel.find()
    return user
}

const getUser = async (_id) => {
    const user = await userModel.findById(_id)
    return user
}

const createUser = async (name, email, phone) => {
    const user = await userModel.create({
        name,
        email,
        phone,
    })

    return user
}

const updateUser = async (_id, name, email, phone,) => {
    const user = await userModel.updateOne({_id},
        {
        name,
        email,
        phone,
    })

    return user
}
const deleteUser = async (_id) => {
    const user = await userModel.deleteOne({_id})
    return user
}

module.exports = {getUsers, getUser, createUser, updateUser, deleteUser}