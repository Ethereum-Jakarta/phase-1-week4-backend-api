const TodoService = require("../service/todo.service.js");

const getTodos = async (_,res)=>{
    try {
        const result = await TodoService.getTodos();
        if(result.length>0){
            res.status(200).json({
                status:200,
                data:result,
                message:"Get Todos Success"
            })   
        }else{
            res.status(404).json({
                status: 404,   
                message: "Data not found",
                data: result,
              });
        }
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}


const getTodo = async (req,res)=>{
    try {
        const id = req.params.id;
        const result = await TodoService.getTodo({id})
        res.status(200).json({
            status:200,
            data:result,
            message:"Get Todo Success"
        })  
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

const createTodo = async (req,res)=>{
    try {
        const {title, description, status, userId} = req.body 
        const result = await TodoService.createTodo({title, description, status, userId})
        res.status(201).json({
            status:201,
            data:result,
            message:"Create Todo Success"
        })   
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

const updateTodo = async (req, res)=>{
    try {
        const id = req.params.id
        const {title, description, status, userId} = req.body 
        const result = await TodoService.updateTodo({id, title, description, status, userId})
        res.status(200).json({
            status:200,
            data:result,
            message:`Updated Todo: ${id} Success`
        })   
        
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}


const deleteTodo = async (req, res)=>{
    try {
        const id = req.params.id
        const result = await TodoService.deleteTodo({id})
        res.status(200).json({
            status:200,
            data:result,
            message:`Deleted Todo: ${id} Success`
        })   
        
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}


module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}

