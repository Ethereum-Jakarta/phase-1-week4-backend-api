const todoService = require('../service/todo.service');

class todoController {
    static async create(req, res) {
        try {
            const newTodo = req.body;

            if (!newTodo) {
                return res.status(400).json({ message: 'All fields required' });
            }

            const result = await todoService.create(newTodo);

            if (!result || result instanceof Error) {
                throw new Error('Failed to create todo');
            }

            res.status(201).json({
                status: 201,
                message: 'Create todo success',
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async getTodo(req, res) {
        try {
            const result = await todoService.getTodo();

            if (!result || result instanceof Error) {
                throw new Error('Failed to ge todo');
            }

            res.status(200).json({
                status: 200,
                message: 'Get todo success',
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const filter = req.params;
            const updateTodo = req.body;

            if (!updateTodo) {
                return res.status(400).json({ message: 'All fields required' });
            }

            const result = await todoService.update(filter, updateTodo);

            if (!result || result instanceof Error) {
                throw new Error('Failed to update todo');
            }

            res.status(200).json({
                status: 200,
                message: 'Update todo success',
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const filter = req.params;

            if (!filter) return res.status(400).json({ message: 'Filter required' });

            const result = await todoService.delete(filter);

            if (!result) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            res.status(200).json({
                status: 200,
                message: 'Delete todo success',
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = todoController;