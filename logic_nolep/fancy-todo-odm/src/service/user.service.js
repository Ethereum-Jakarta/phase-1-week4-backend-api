const modelUser = require('../model/user.model');
const modelTodo = require('../model/todo.model');

class User {

    static async create(newUser) {
        try {
            const user = new modelUser(newUser);
            const saved = await user.save();
            return saved;
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }

    static async getUser() {
        try {
            const user = await modelUser.find();
            return user;
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }

    static async update(filter, userUpdate) {
        try {
            const user = await modelUser.findOneAndUpdate(filter, userUpdate, { new: true });
            await user.save();
            return user;
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }

    static async delete(filter) {
        try {
            const user = await modelUser.findOneAndDelete(filter);

            // hapus todo yang berhubungan dengan user yang dihapus
            await modelTodo.deleteMany({ userId: user._id });
            return user;
        } catch (error) {
            console.error("Error saat membuat user:", error);
            throw new Error(error.message);
        }
    }
}

module.exports = User;