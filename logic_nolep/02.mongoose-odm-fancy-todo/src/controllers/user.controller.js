import UserService from "../service/user.service.js";
import mongoose from "mongoose";

class UserController {
    static async create(req, res) {
        const {name, email, phone} = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({
                message: "name, email, age, wajib diisi!!"
            })
        }

        try {
            const user = await UserService.create({name, email,phone});

            res.status(201).json({
                message: "User created successfully",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to create user!!"
            })
        }
    }

    static async update(req, res) {
        const {id} = req.params;
        const {name, email, phone} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        try {
            const user = await UserService.update(id, {name,email, phone});

            if (!user) {
                return res.status(404).json({
                    message: "User not found!!"
                })
            }

            res.json({
                message: "User updated successfully",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to update user"
            })
        }
    }

    static async delete(req, res) {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        try {
            const user = await UserService.delete(id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            
            res.json({
                message: `User ${id} deleted successfully`
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete user"
            })
        }
    }

    static async show(req, res) {
        try {
            const user = await UserService.show();

            res.json({
                message: "Get User successfully",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to get user!!"
            })
        }
    }

    static async find(req, res) {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user Id!"
            })
        }

        try {
            const user = await UserService.find(id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found!!"
                })
            }

            res.json({
                message: `Get Detail ${id} successfully`,
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to get detail user!!"
            })
        }
    }
}

export default UserController;