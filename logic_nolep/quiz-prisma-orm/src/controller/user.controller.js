const userService = require('../service/user.service');

class userController {
    static async create(req, res) {
        try {
            const { name, email, phone } = req.body;

            if (!name || !email || !phone) {
                return res.status(400).json({ message: 'All fields required' });
            }

            const result = await userService.create(name, email, phone);

            if (!result || result instanceof Error) {
                throw new Error('Failed to create user');
            }

            res.status(201).json({
                status: 201,
                message: 'Create user success',
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }
    }

    static async getUser(req, res) {
        try {
            const result = await userService.getUser();

            if (!result || result instanceof Error) {
                throw new Error('Failed to get user');
            }

            res.status(200).json({
                status: 200,
                message: 'Get user success',
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params
            const { name, phone, email } = req.body;

            if (!id || !name || !email || !phone) {
                return res.status(400).json({ message: 'All fields required' });
            }

            const result = await userService.update(id, name, email, phone);

            if (!result || result instanceof Error) {
                throw new Error('Failed to update user');
            }

            res.status(200).json({
                status: 200,
                message: 'Update user success',
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params

            if (!id) {
                return res.status(400).json({ message: 'Id required' });
            }

            const result = await userService.delete(id);

            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                status: 200,
                message: 'Delete user success',
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }
    }
}

module.exports = userController;