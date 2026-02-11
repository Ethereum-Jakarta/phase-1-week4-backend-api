const todoService = require('../services/todo.service')

class TodoController {
	static getTodo = async (req, res) => {
		try {
			const todo = await todoService.show()
			res.status(200).send({
				status: 200,
				message: 'Data Ok',
				data: todo
			})
		} catch(e) {
			res.status(500).send({
				status: 500,
				message: 'Internal Server Error',
				errMsg: e.message
			})
		}
	}

	static createTodo = async (req, res) => {
		const body = req.body
		try {
			const newTodo = await todoService.create(body.title, body.description, body.status, body.userId)
			res.status(200).send({
				status: 200,
				message: 'Data Created',
				data: newTodo
			})
		} catch(e) {
			res.status(500).send({
				status: 500,
				message: 'Internal Server Error',
				errMsg: e.message
			})
		}
	}

	static updateTodo = async (req, res) => {
		const body = req.body
		try {
			const updatedTodo = await todoService.update(req.params.id, body.title, body.description, body.status, body.userId)
			res.status(200).send({
				status: 200,
				message: 'Data Updated',
				data: updatedTodo
			})
		} catch(e) {
			res.status(500).send({
				status: 500,
				message: 'Internal Server Error',
				errMsg: e.message
			})
		}
	}

	static deleteTodo = async (req, res) => {
		try {
			const deletedTodo = await todoService.delete(req.params.id)
			res.status(200).send({
				status: 200,
				message: 'Data Deleted',
				data: deletedTodo
			})
		} catch(e) {
			res.status(500).send({
				status: 500,
				message: 'Internal Server Error',
				errMsg: e.message
			})
		}
	}
}

module.exports = TodoController