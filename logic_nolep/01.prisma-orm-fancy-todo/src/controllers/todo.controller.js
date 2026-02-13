import Todo from "../services/todo.service.js";

class TodoController {
    static async create (req, res) {
        const {title, description, status, userId} = req.body
        const parsedUserId = Number(userId)

        if (!title || !description || !status || !userId) {
            return res.status(400).json({
                message : "title, description, status, userId wajib diisi"
            })
        }

        if (isNaN(parsedUserId)) {
            return res.status(400).json({
                message: "userId harus berupa angka"
            });
        }

        try {
            const todo = await Todo.create({title, description, status, userId : parsedUserId});

            res.status(201).json({
                message : "Todo created successfully",
                todo
            })
        } catch (error) {
            res.status(500).json({
                message : "Failed to created todo!!"
            })
        }
    }

    static async update (req, res) {
        const {id} = req.params;
        const {title, description, status} = req.body;
        const parsedId = Number(id);

        if (isNaN(parsedId)) {
            return res.status(400).json({
                message: "Id harus berupa angka"
            });
        }

        try {
            const exist = await Todo.find(id);

            if (!exist) {
                return res.status(404).json({
                    message : "Todo not found!!"
                })
            }

            const todo = await Todo.update(parsedId, title, description, status);
            res.json({
                message : "Todo updated successfully",
                todo
            })
        } catch (error) {
            res.status(500).json({
                message : "Failed to updated todo"
            })
        }
    }

    static async delete (req, res) {
        const {id} = req.params;
        const parseId = Number(id);

        if (isNaN(parseId)) {
            return res.status(400).json({
                message: "Id harus berupa angka"
            });
        }

        try {
            const exist = await Todo.find(parseId);

            if (!exist) {
                return res.status(404).json({
                    message : "Todo not found!!"
                })
            }

            const todo = await Todo.delete(parseId);

            res.json({
                message : `Todo ${id} deleted successfully`
            })
        } catch (error) {
            res.status(500).json({
                message : "Failed to deleted todo"
            })
        }
    }

    static async show (req, res) {
        try {
            const todo = await Todo.show();

            if (todo.length === 0) {
                return res.json({
                    message : "Data empty",
                    data : []
                })
            }

            res.json({
                message : "Get data todo successfully",
                todo
            })
        } catch (error) {
            res.status(500).json({
                message : "Failed to show data!!"
            })
        }
    }

    static async find(req, res) {
        const {id} = req.params;
        const parseId = Number(id)

        try {
            const todo = await Todo.find(parseId);

            if (!todo) {
                return res.status(404).json({message : "Todo not found!!"})
            }

            res.json({
                message : `Find data ${parseId} successfully`,
                todo
            })
        } catch (error) {
            res.status(500).json({
                message : "Failed to find todo!!"
            })
        }
    }
}

export default TodoController;