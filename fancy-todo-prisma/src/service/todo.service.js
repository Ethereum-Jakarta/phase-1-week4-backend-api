const prisma = require("../../prisma/client.js");

const getTodos = async () =>{
    const res = await prisma.todo.findMany();
    return res;
}

const getTodo = async ({id}) =>{
    const res = await prisma.todo.findUnique({
        where:{
            id:parseInt(id)
        }
       
    })
    return res
}


const createTodo = async ({title, description, status, userId})=>{
    const res = await prisma.todo.create({
        data:{
            title:title,
            description:description,
            status:status,
            userId:userId
        }
    })
    return res;
}

const updateTodo = async ({id, title, description, status, userId})=>{
    const res = await prisma.todo.update({
        data:{
            title:title,
            description:description,
            status:status,
            userId:userId
        },
        where:{
            id:parseInt(id)
        }
    })
    return res;

}

const deleteTodo = async ({id})=>{
    const res = await prisma.todo.delete({
        where:{
            id:parseInt(id)
        }
    })
    return res;

}

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}