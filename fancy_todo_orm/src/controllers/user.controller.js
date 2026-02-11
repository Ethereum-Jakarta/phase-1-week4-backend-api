const userService = require('../services/user.service')

class UserController {
	static getUsers = async ( req, res ) => {
		const data = await userService.show()
		try {
			res.status(200).send({
				status: 200,
				message: 'Data Ok',
				data: data
			})
		} catch(e) {
			res.status(500).send({
				status: 500,
				message: 'Internal Server Error',
				err: e.message
			})
		}
	}

	static createUser = async (req, res) => {
		try {
			const body = req.body;
			const data = await userService.create(body.name, body.email, body.phone)
			res.status(200).send({
				status: 200,
				message: 'Data Created',
				data: data
			})
		} catch(e) {
			res.status(500).send({
				status: 500,
				message: 'Internal Server Error',
				errMsg: e.message
			})	
		}
	}

	static updateUser = async (req, res) => {
		try {
			const body = req.body;
			const data = await userService.update(req.params.id, body.name, body.email, body.phone)
			res.status(200).send({
				status: 200,
				message: 'Data Updated',
				data: data
			})
		} catch(e) {
			res.status(500).send({
				status: 500,
				message: 'Internal Server Error',
				errMsg: e.message
			})	
		}
	}

	static deleteUser = async (req, res) => {
		try {
			const data = await userService.delete(req.params.id)
			res.status(200).send({
				status: 200,
				message: "Data Deleted",
				data: data
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

module.exports = UserController