const todoServices = require('../service/todo.service')


const getTodos = async (req, res) => {
    try {
        // console.log("coba")
        const result = await todoServices.getTodos()
        res.status(200).send({
            status: 200,
            message: "Get Todos Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "Get Todos Error",
            data: null
        })

    }
}

const findTodo = async (req, res) => {
    try {
        // console.log("coba")
        const result = await todoServices.findTodo(req.params.todoId)
        res.status(200).send({
            status: 200,
            message: "Get Todo Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "Get Todo Error",
            data: null
        })

    }
}
const findTodoByUserId = async (req, res) => {
    try {
        // console.log("coba")
        const result = await todoServices.findTodoByUserId(req.params.userId)
        res.status(200).send({
            status: 200,
            message: "Get Todo Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "Get Todo Error",
            data: null
        })

    }
}

const createTodo = async (req, res) => {
    try {
        // console.log("coba")
        const result = await todoServices.createTodo(req.body)
        res.status(200).send({
            status: 200,
            message: "create Todo Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "create Todo Error",
            data: null
        })

    }
}
const updateTodo = async (req, res) => {
    try {
        // console.log("coba")
        const result = await todoServices.updateTodo(req.body,req.params.todoId)
        res.status(200).send({
            status: 200,
            message: "update Todo Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "update Todo Error",
            data: null
        })

    }
}
const deleteTodo = async (req, res) => {
    try {
        // console.log("coba")
        const result = await todoServices.deleteTodo(req.params.todoId)
        res.status(200).send({
            status: 200,
            message: "delete Todo Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "delete Todo Error",
            data: null
        })

    }
}


module.exports = {
    getTodos,
    findTodo,
    findTodoByUserId,
    createTodo,
    updateTodo,
    deleteTodo
}