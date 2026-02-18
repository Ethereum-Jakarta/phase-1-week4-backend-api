const todoService = require('../service/todo.service');

class todoController {
    static async create(req, res) {
        try {
            const { title, description, status, userId } = req.body;

            if (!title || !description || !status || !userId) {
                return res.status(400).json({ message: 'All fields required' });
            }

            const result = await todoService.create(title, description, status, userId);

            if (!result || result instanceof Error) {
                throw new Error('Failed to create todo');
            }

            res.status(201).json({
                status: 201,
                message: 'Create todo success',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }
    }

    static async getTodo(req, res) {
        try {
            const result = await todoService.getTodo();

            if (!result || result instanceof Error) {
                throw new Error('Failed to get todo');
            }

            res.status(200).json({
                status: 200,
                message: 'Get todo success',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const id = req.params.id
            const { title, description, status, userId } = req.body;

            if (!id || !title || !description || !status || !userId) {
                return res.status(400).json({ message: 'All fields required' });
            }

            const result = await todoService.update(id, title, description, status, userId);

            if (!result || result instanceof Error) {
                throw new Error('Failed to update todo');
            }

            res.status(201).json({
                status: 201,
                message: 'Update todo success',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }

    }

    static async delete(req, res) {
        try {
            const id = req.params.id

            if (!id) {
                return res.status(400).json({ message: 'Id required' });
            }
            const result = await todoService.delete(id);

            if (!result || result instanceof Error) {
                throw new Error('Failed to delete todo');
            }

            res.status(200).json({
                status: 200,
                message: 'Delete todo success',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'internal server error',
                error: error.message
            });
        }
    }
}

module.exports = todoController