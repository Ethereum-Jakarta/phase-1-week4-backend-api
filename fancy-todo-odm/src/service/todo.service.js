const prisma = require("../../prisma/client") 

const getTodos = async () => {
    const result = await prisma.todo.findMany();
    return result;
}
const findTodo = async (todoId) => {
    const result = await prisma.todo.findUnique({
        where: {id:todoId}
    });
    return result;
}
const findTodoByUserId = async (UserId) => {
    const result = await prisma.todo.findMany({
        where: {userId:UserId}
    });
    return result;
}
const createTodo = async (todoBody) => {
    const result = await prisma.todo.create({
        data:todoBody
    });
    return result;
}
const updateTodo = async (todoBody,todoId) => {
    const result = await prisma.todo.update({
        where: {id:todoId},
        data:todoBody
    });
    return result;
}
const deleteTodo = async (todoId) => {
    const result = await prisma.todo.delete({
        where: {id:todoId}
    });
    return result;
}



module.exports = {
    getTodos,
    findTodo,
    findTodoByUserId,
    createTodo,
    updateTodo,
    deleteTodo
}