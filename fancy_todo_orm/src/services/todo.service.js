const prisma = require('../../prisma/client')

class Todo {
	static create = async ( title, description, status, userId ) => {
		const todo = await prisma.todo.create({
			data: {
				title, description, status, userId
			}
		})
		return todo
	}

	static update = async ( id, title, description, status, userId ) => {
		const updateData = await prisma.todo.update({
			where: {
				id: parseInt(id)
			},
			data: {
				title, description, status, userId
			}
		})

		return updateData
	}

	static delete = async(id) => {
		const deleteData = await prisma.todo.delete({
			where: {
				id: parseInt(id)
			}
		})

		return deleteData
	}

	static show = async() => {
		const todos = await prisma.todo.findMany()
		return todos
	}
}

module.exports = Todo