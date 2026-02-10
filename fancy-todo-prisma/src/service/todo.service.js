const prisma = require('../../prisma/client')

const showTodos = async () => {
    const result = await prisma.todo.findMany()
    return result
}

const getTodoById = async (id) => {
    const result = await prisma.todo.findUnique({
        where: {
            id 
        }
    })

    return result
}

const createTodo = async (title, description, status, userId) => {
    const user = await prisma.todo.create({
        data: {
            title,
            description,
            status,
            userId
        }
    })

    return user
}

const updateTodo = async (id, title, description, status, userId) => {
    const result = await prisma.todo.update({
        where:{
            id
        },
        data: {
            title,
            description,
            status,
            userId
        }
    })

    return result
}

const deleteTodo = async (id) => {
    const result = await prisma.todo.delete({
        where:{
            id
        }
    })

    return result
}


module.exports = {createTodo, showTodos, getTodoById, updateTodo, deleteTodo}