const Todo = require('../models/todo.model')

const showTodos = async () => {
    const result = await Todo.find({})
    return result
}

const getTodoById = async (id) => {
    const result = await Todo.findOne({_id: id})

    return result
}

const createTodo = async (title, description, status, userId) => {
    const result = await Todo.create({title, description, status, userId})

    return result
}

const updateTodo = async (id, title, description, status, userId) => {
    const result = await Todo.updateOne({_id: id}, {title, description, status, userId})

    return result
}

const deleteTodo = async (id) => {
    const result = await Todo.deleteOne({_id: id})

    return result
}


module.exports = {createTodo, showTodos, getTodoById, updateTodo, deleteTodo}