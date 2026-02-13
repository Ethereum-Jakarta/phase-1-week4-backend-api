const prisma = require("../../prisma/client.js");

const getUsers = async () =>{
    const res = await prisma.user.findMany();
    return res;
}

const getUser = async ({id}) =>{
    const res = await prisma.user.findUnique({
        where:{
            id:parseInt(id)
        }
       
    })
    return res
}

const getUserTodos = async ({id}) =>{
    const res = await prisma.user.findUnique({
        where:{
            id:parseInt(id)
        },
        include: {
            todos: true
        }
    })
    return res
}

const createUser = async ({name,email,phone})=>{
    const res = await prisma.user.create({
        data:{
            name:name,
            email:email,
            phone:phone
        }
    })
    return res;
}

const updateUser = async({id, name, email, phone})=>{
    const res = await prisma.user.update({
        data:{
            name:name,
            email:email,
            phone:phone
        },
        where:{
            id:parseInt(id)
        }
    })
    return res;
}
    
const deleteUser = async({id})=>{
    const res = await prisma.user.delete({
        where:{
            id:parseInt(id)
        }
    })
    return res;
}

module.exports = {
    getUsers,
    getUser,
    getUserTodos,
    createUser,
    updateUser,
    deleteUser
};


// app.get("/user", async (req, res, next)=>{
//     try {
//         const result = await prisma.user.findMany()
//         res.json({
//             data:result,
//             message:"User List"
//         })    
        
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// })

// app.post("/user", async (req, res, next)=>{
//     try {
//         const {name, email, phone } = req.body 
//         const result = await prisma.user.create({
//             data:{
//                 name:name,
//                 email:email,
//                 phone:phone
//             }
//         })
//         res.json({
//             data:result,
//             message:"User Created"
//         })
        
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
   
// })

// app.put("/user/:id", async (req, res, next)=>{
//     try {
//         const {id} = req.params
//         const {name, email, phone} = req.body 
//         const result = await prisma.user.update({
//             data:{
//                 name:name,
//                 email:email,
//                 phone:phone
//             },
//             where:{
//                 id:parseInt(id)
//             }
//         })
//         res.json({
//             data:result,
//             message:`User ${id} Updated`
//         })
        
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
   
// })


// app.delete("/user/:id", async (req, res, next)=>{
//     try {
//         const {id} = req.params
//         const result = await prisma.user.delete({
//             where:{
//                 id:parseInt(id)
//             }
//         })
//         res.json({
//             data:result,
//             message:`User ${id} Deleted`
//         })
        
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
   
// })

