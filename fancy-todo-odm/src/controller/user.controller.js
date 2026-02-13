const userService = require('../services/user.service')

const getUsers = async (req, res) => {
    try {
        const dataUser = await userService.getUsers()
        res.status(200).json({
            status: 200,
            message: 'Get All Data Users Succsess!',
            data: dataUser
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const getUser = async (req, res) => {
    try {
        const userid = req.params.id
        const dataUser = await userService.getUser(userid)
        res.status(200).json({
            status: 200,
            message: 'Get Data Users by id Succsess!',
            data: dataUser
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const createUser = async (req, res) => {
    try {
        const {name, email, phone} = req.body;
        const dataUser = await userService.createUser(
            name,
            email,
            phone
        )
        res.status(200).json({
            status: 200,
            message: 'Create User Succsess!',
            data: dataUser
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const {name, email, phone} = req.body
        const userid = req.params.id
        const dataUser = await userService.updateUser(
            userid,
            name,
            email,
            phone
        )
        res.status(200).json({
            status: 200,
            message: 'Update User Succsess!',
            data: dataUser
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userid = req.params.id
        const newUser = await userService.deleteUser(
            userid
        )
        res.status(200).json({
            status: 200,
            message: 'Delete User Succsess!',
            data: newUser
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

module.exports = {getUsers, getUser, createUser, updateUser, deleteUser}