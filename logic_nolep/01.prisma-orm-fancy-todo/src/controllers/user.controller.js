import Users from "../services/user.service.js";

class UsersController {
    static async create (req, res) {
        const {name, email, phone} = req.body;

        if (!name || !email || !phone) {
            return res.status(404).json({
                message : "name, email, phone wajib diisi"
            })
        }
        
        try {
            const user = await Users.create({name, email, phone})

            res.status(201).json({
                message: "User Created Successfully",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to create user!!!"
            })
        }
    }

    static async update (req, res) {
        const {id} = req.params;
        const data = req.body;

        try {
            const exist = await Users.find(id);

            if (!exist) {
                return res.status(404).json({message : "User not found!!"})
            }

            const user = await Users.update(id, data);

            res.json({
                message: "User updated successfully",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to update user!!!"
            })
        }
    }

    static async delete (req, res) {
        const {id} = req.params;

        try {
            const exist = await Users.find(id);

            if (!exist) {
                return res.status(404).json({message : "User not found!!"})
            }

            const user = await Users.delete(id);

            res.json({
                message: `User ${id} deleted successfully`
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete user!!!"
            })
        }
    }

    static async show (req, res) {
        try {
            const users = await Users.show()

            if (users.length === 0) {
                return res.json({
                    message : "Data empty",
                    data: []
                })
            }

            res.json({
                message: "Show data successfully",
                users
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to show data users"
            })
        }
    }

    static async find (req, res) {
        const {id} = req.params;

        try {
            const user = await Users.find(id)

            if (!user) {
                return res.status(404).json({message : "User not found!!"})
            }

            res.json({
                message : `Find data ${id} successfully`,
                user
            })
        } catch (error) {
            res.status(500).json({
                message : "Failed to find user!!!"
            })
        }
    }
}

export default UsersController;