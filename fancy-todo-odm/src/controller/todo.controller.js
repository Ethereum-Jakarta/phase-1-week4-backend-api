const todoService = require('../services/todo.service')

const getTodos = async (req, res) => {
    try {
        const dataTodo = await todoService.getTodos()
        res.status(200).json({
            status: 200,
            message: 'Get All Data Todo Succsess!',
            data: dataTodo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const getTodo = async (req, res) => {
    try {
        const todoid = req.params.id
        const dataTodo = await todoService.getTodo(todoid)
        res.status(200).json({
            status: 200,
            message: 'Get Data Todo by id Succsess!',
            data: dataTodo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const createTodo = async (req, res) => {
    try {
        const {title, description, status, userId} = req.body
        const dataTodo = await todoService.createTodo(
            title, 
            description, 
            status, 
            userId
        )
        res.status(200).json({
            status: 200,
            message: 'Create Todo Succsess!',
            data: dataTodo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const updateTodo = async (req, res) => {
    try {
        const {title, description, status, userId} = req.body
        const todoid = req.params.id
        const dataTodo = await todoService.updateTodo(
            todoid,
            title, 
            description, 
            status, 
            userId
        )
        res.status(200).json({
            status: 200,
            message: 'Update Todo Succsess!',
            data: dataTodo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

const deleteTodo = async (req, res) => {
    try {
        const todoid = req.params.id
        const dataTodo = await todoService.deleteTodo(todoid)
        res.status(200).json({
            status: 200,
            message: 'Delete User Succsess!',
            data: dataTodo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error!',
            error: error.message
        })
    }
}

module.exports = {getTodos, getTodo, createTodo, updateTodo, deleteTodo}