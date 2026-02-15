const userService = require("@services/user.service");


const createUser = async (req, res) => {
  try {
    const create = await userService.createUser(req.body);
    return res.status(201).json(create);
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    return res.status(200).json({ message: "User deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await userService.updateUser(id, req.body);
    return res.status(200).json({ message: "User updated", data: updated });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ message: "Get all users", data: users });
  } catch (error) {
    console.error("Error getting all users:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to get all users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const {id} = req.params
    const users = await userService.getUserById(id);
    return res.status(200).json({ message: `Getting user with ID: ${users.id}`, data: users });
  } catch (error) {
    console.error("Error getting user:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to get user", error: error.message });
  }
};


module.exports = { createUser, getAllUsers, updateUser, deleteUser, getUserById };
