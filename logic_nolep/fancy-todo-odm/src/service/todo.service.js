const modelTodo = require('../model/todo.model');

class Todo {

    static async create(newTodo) {
        try {
            const todo = new modelTodo(newTodo);
            const saved = await todo.save();
            return saved;
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }

    static async getTodo() {
        try {
            const todo = await modelTodo.find();
            return todo
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }

    static async update(filter, todoUpdate) {
        try {
            const todo = await modelTodo.findOneAndUpdate(filter, todoUpdate, { new: true });
            await todo.save();
            return todo;
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }

    static async delete(filter) {
        try {
            const todo = await modelTodo.findOneAndDelete(filter);
            return todo;
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }
}

module.exports = Todo;