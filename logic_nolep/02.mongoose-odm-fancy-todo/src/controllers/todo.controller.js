import TodoService from "../service/todo.service.js";

class TodoController {
    static async create (req, res) {
        const {title, description, status, userId} = req.body;

        if(!title || !description || !userId) {
            return res.status(400).json({
                message: "title, description, status, wajib diisi!!!"
            })
        }

        try {
            const todo = await TodoService.create({title, description, status, userId});

            res.status(201).json({
                message: "Todo created successfully",
                todo
            })
        } catch (error) {
            if(error.message === "User not found!!") {
                return res.status(404).json({
                    message: "User not found!!"
                })
            }

            res.status(500).json({
                message: "Failed to create todo!!"
            })
        }
    }

    static async update(req, res) {
        const {id} = req.params;
        const {title, description, status} = req.body;

        try {
            const todo = await TodoService.update(id, {title, description, status});

            res.json({
                message: "Todo updated successfully",
                todo
            })
        } catch (error) {
            if(error.message === "Todo not found!!") {
                return res.status(404).json({
                    message: "Todo not found!!"
                })
            }

            res.status(500).json({
                message: "Failed to update todo!!"
            })
        }
    }

    static async delete(req, res) {
        const {id} = req.params;

        try {
            const todo = await TodoService.delete(id);

            res.json({
                message: `Todo ${id} deleted successfully`
            })
        } catch (error) {
            if (error.message === "Todo not found!!") {
                return res.status(404).json({
                    message: "Todo not found!!"
                })
            }

            res.status(500).json({
                message: "Failed to delete todo!!"
            })
        }
    }

    static async show(req, res) {
        try {
            const todo = await TodoService.show();

            res.json({
                message: "Get data todo successfully",
                todo
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to get data todo"
            })
        }
    }

    static async find(req, res) {
        const {id} = req.params;

        try {
            const todo = await TodoService.find(id);

            res.json({
                message: `Get detail ${id} successfully`,
                todo
            })
        } catch (error) {
            if (error.message === "Todo not found!!") {
                return res.status(404).json({
                    message: "Todo not found!!"
                })
            }

            res.status(500).json({
                message: `Failed to get detail todo ${id}`
            })
        }
    }
}

export default TodoController;