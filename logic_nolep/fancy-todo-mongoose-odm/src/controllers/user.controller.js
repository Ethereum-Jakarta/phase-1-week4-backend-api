const userService = require("../services/user.service");

const handleResponse = (res, status, message, data = null, error = null) => {
  res.status(status).json({
    status,
    message,
    data,
    error,
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    handleResponse(res, 200, "Success get users!", users);
  } catch (err) {
    handleResponse(res, 500, "Failed to get users!", null, err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    handleResponse(res, 200, "Success get user!", user);
  } catch (err) {
    handleResponse(res, 500, "Failed to get user!", null, err.message);
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const createdUser = await userService.createUser({ name, email, phone });
    handleResponse(res, 200, "Success create user!", createdUser);
  } catch (err) {
    handleResponse(res, 500, "Failed to create user!", null, err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(userId, {
      name,
      email,
      phone,
    });
    handleResponse(res, 200, "Success update user!", updatedUser);
  } catch (err) {
    handleResponse(res, 500, "Failed to update user!", null, err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    handleResponse(res, 200, "Success delete user!", deletedUser);
  } catch (err) {
    handleResponse(res, 500, "Failed to delete user!", null, err.message);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
