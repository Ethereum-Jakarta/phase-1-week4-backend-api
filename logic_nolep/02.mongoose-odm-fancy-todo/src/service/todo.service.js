import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";

class TodoService {
    static async create(data) {
        const userExists = await User.exists({_id: data.userId});

        if (!userExists) {
            throw new Error("User not found!!");
        }

        return await Todo.create(data)
    }

    static async update(id, data) {
        const todoExists = await Todo.exists({_id: id})

        if (!todoExists) {
            throw new Error("Todo not found!!");
        }

        return await Todo.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
    }

    static async delete(id) {
        const todoExists = await Todo.exists({_id : id});

        if (!todoExists) {
            throw new Error("Todo not found!!")
        }

        return await Todo.findByIdAndDelete(
            id
        )
    }

    static async show() {
        return await Todo.find()
    }

    static async find(id) {
        const todoExists = await Todo.exists({_id : id});

        if (!todoExists) {
            throw new Error("Todo not found!!")
        }

        return await Todo.findById(
            id
        )
    }
}

export default TodoService;