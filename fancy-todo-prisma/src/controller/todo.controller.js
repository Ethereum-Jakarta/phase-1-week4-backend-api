const todoService = require('../services/todo.service')

const getTodos = async(req,res) => {
    try {
        const todo = await todoService.getTodos()
        res.status(200).json({
            status: 200,
            message: 'Get All Data Todos Succsess!',
            data: todo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}

const getTodo = async(req,res) => {
    try {
        const todoid = req.params.id
        const todo = await todoService.getTodo(todoid)
        console.log(todo)
        res.status(200).json({
            status: 200,
            message: 'Get Data Todo Succsess',
            data: todo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}

const createTodo = async(req,res) => {
    try {
        const {title, description, status, userId} = req.body
        const todo = await todoService.createTodo(title, description, status, userId)
        res.status(200).json({
            status: 200,
            message: 'Create Todo Succsess!',
            data: todo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}

const updateTodo = async(req,res) => {
    try {
        const {title, description, status, userId} = req.body
        const todoid = req.params.id;
        const todo = await todoService.updateTodo(title, description, status, userId, todoid)
        res.status(200).json({
            status: 200,
            message: 'Update Todo Succsess!',
            data: todo
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}

const deleteTodo = async(req,res) => {
    try {
        const todoid = req.params.id;
        const user = await todoService.deleteTodo(todoid)
        res.status(200).json({
            status: 200,
            message: 'Delete Todo Succsess!',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}

module.exports = {getTodos, getTodo, createTodo, updateTodo, deleteTodo}