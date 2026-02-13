const todoModel = require('../models/todo.model')

const getTodos = async () => {
    const todo = await todoModel.find()
    return todo
}

const getTodo = async (_id) => {
    const todo = await todoModel.findById(_id)
    return todo
}

const createTodo = async (title, description, status, userId) => {
    const todo = await todoModel.create({
        title, 
        description, 
        status, 
        userId
    })

    return todo
}

const updateTodo = async (_id, title, description, status, userId) => {
    const todo = await todoModel.updateOne({_id}, {
        title, 
        description, 
        status, 
        userId
    })

    return todo
}
const deleteTodo = async (_id) => {
    const todo = await todoModel.deleteOne({_id})
    return todo
}

module.exports = {getTodos, getTodo, createTodo, updateTodo, deleteTodo}