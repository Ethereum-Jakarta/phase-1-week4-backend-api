const userRouter = require('./user.route')
const todoRouter = require('./todo.route')

module.exports ={
	user: userRouter, 
	todo: todoRouter
}
