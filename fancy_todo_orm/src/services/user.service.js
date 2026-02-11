const prisma = require('../../prisma/client')

class User {
	static create = async (name, email, phone) => {
		const userData = {
			name: name,
			email: email,
			phone: phone
		}

		const users = await prisma.user.create({data: userData})

		return users
	}

	static update = async ( id, name, email, phone ) => {
		const userData = {
			name: name,
			email: email,
			phone: phone
		}

		const userUpdate = await prisma.user.update({
			where: {
				id: parseInt(id)
			}, data: userData
		})

		return userUpdate
	}

	static delete = async ( id ) => {
		const userDelete = await prisma.user.delete({
			where: {
				id: parseInt(id)
			}
		})

		return userDelete
	}

	static show = async () => {
		const data = await prisma.user.findMany()
		return data
	}
}

module.exports = User