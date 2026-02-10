const todoService = require('../service/todo.service')

const showTodos = async(req, res) => {
    try{
        const result = await todoService.showTodos()
        res.status(200).send({
            status: 200,
            message: "Get todos Success",
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

const createTodo = async (req, res) => {
    try{
        const { title, description, status, userId } = req.body
        const result = await todoService.createTodo(title, description, status, userId)
        res.status(200).send({
            status: 200,
            message: "Create todo Success",
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

const getTodoById = async(req, res) => {
    try{
        const id = req.params.id
        const result = await todoService.getTodoById(id)
        res.status(200).send({
            status: 200,
            message: "Get todo by id Success",
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

const updateTodo = async (req, res) => {
    try{
        const id = req.params.id
        const { title, description, status, userId} = req.body
        const result = await todoService.updateTodo(id, title, description, status, userId)
        res.status(200).send({
            status: 200,
            message: "Update todo Success",
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

const deleteTodo = async (req, res) => {
    try{
        const id = req.params.id
        const result = await todoService.deleteTodo(id)
        res.status(200).send({
            status: 200,
            message: "Delete todo Success",
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

module.exports = { createTodo, showTodos, getTodoById, updateTodo, deleteTodo}