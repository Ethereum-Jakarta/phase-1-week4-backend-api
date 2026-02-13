const UserService = require("../service/user.service.js");

const getUsers = async (_,res)=>{
    try {
        const result = await UserService.getUsers();
        if(result.length>0){
            res.status(200).json({
                status:200,
                data:result,
                message:"Get Users Success"
            })   
        }else{
            res.status(404).json({
                status: 404,   
                message: "Data not found",
                data: result,
              });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

const getUser = async (req,res)=>{
    try {
        const id = req.params.id;
        const result = await UserService.getUser({id})
        res.status(200).json({
            status:200,
            data:result,
            message:"Get User Success"
        })  
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

const getUserTodos = async (req,res)=>{
    try {
        const id = req.params.id;
        const result = await UserService.getUserTodos({id})
        res.status(200).json({
            status:200,
            data:result,
            message:"Get User Todos Success"
        })  
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

const createUser = async (req,res)=>{
    try {
        const {name, email, phone } = req.body 
        const result = await UserService.createUser({name,email,phone})
        res.status(201).json({
            status:201,
            data:result,
            message:"Create User Success"
        })   
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}

const updateUser = async (req, res)=>{
    try {
        const id = req.params.id
        const {name, email, phone } = req.body 
        const result = await UserService.updateUser({id,name,email,phone})
        res.status(200).json({
            status:200,
            data:result,
            message:`Updated User: ${id} Success`
        })   
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}


const deleteUser = async (req, res)=>{
    try {
        const id = req.params.id
        const result = await UserService.deleteUser({id})
        res.status(200).json({
            status:200,
            data:result,
            message:`Deleted User: ${id} Success`
        })   
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
          });
    }
}


module.exports = {
    getUsers,
    getUser,
    getUserTodos,
    createUser,
    updateUser,
    deleteUser
}

