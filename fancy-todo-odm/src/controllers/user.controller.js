const userService = require('../service/user.service')

const showUsers = async(req, res) => {
    try{
        const result = await userService.showUsers()
        res.status(200).send({
            status: 200,
            message: "Get users Success",
            data: result,
        })
    }catch(err){
        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const createUser = async (req, res) => {
    try{
        const { name, email, phone } = req.body
        const result = await userService.createUser(name, email, phone)
        res.status(200).send({
            status: 200,
            message: "Create user Success",
            data: result,
        })

    }catch(err){
        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const getUserById = async(req, res) => {
    try{
        const id = req.params.id
        const result = await userService.getUserById(id)
        res.status(200).send({
            status: 200,
            message: "Get user by id Success",
            data: result,
        })
    }catch(err){
        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const updateUser = async (req, res) => {
    try{
        const id = req.params.id
        const { name, email, phone} = req.body
        const result = await userService.updateUser(id, name, email, phone)
        res.status(200).send({
            status: 200,
            message: "Update user Success",
            data: result,
        })
    }catch(err){
        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const deleteUser = async (req, res) => {
    try{
        const id = req.params.id
        const result = await userService.deleteUser(id)
        res.status(200).send({
            status: 200,
            message: "Delete user Success",
            data: result,
        })
    }catch(err){
        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

module.exports = { createUser, showUsers, getUserById, updateUser, deleteUser}