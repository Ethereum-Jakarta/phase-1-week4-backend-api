const express = require("express");
const router = require("./routes")

const app = express();

app.use(express.json());


app.use(router);

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

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

module.exports = app;