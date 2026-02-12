const userServices = require('../service/user.service')


const getUsers = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userServices.getUsers()
        res.status(200).send({
            status: 200,
            message: "Get Users Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "Get Users Error",
            data: null
        })

    }
}

const findUser = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userServices.findUser(req.params.userId)
        res.status(200).send({
            status: 200,
            message: "Get User Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "Get User Error",
            data: null
        })

    }
}

const createUser = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userServices.createUser(req.body)
        res.status(200).send({
            status: 200,
            message: "create User Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "create User Error",
            data: null
        })

    }
}
const updateUser = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userServices.updateUser(req.body,req.params.userId)
        res.status(200).send({
            status: 200,
            message: "update User Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "update User Error",
            data: null
        })

    }
}
const deleteUser = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userServices.deleteUser(req.params.userId)
        res.status(200).send({
            status: 200,
            message: "delete User Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "delete User Error",
            data: null
        })

    }
}


module.exports = {
    getUsers,
    findUser,
    createUser,
    updateUser,
    deleteUser
}