const userService = require('../services/user.service');

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).send({
      status: 200,
      message: 'Get All User Success',
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, phone } = req.body;
    const result = await userService.createUser(name, email, phone);
    res.status(200).send({
      status: 200,
      message: 'Create User Success',
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.getUser(id);
    res.status(200).send({
      status: 200,
      message: 'Get User Success',
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.status(200).send({
      status: 200,
      message: 'Delete User Success',
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const result = await userService.updateUser(id, name, email, phone);
    res.status(200).send({
      status: 200,
      message: 'Update User Success',
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
module.exports = { getAllUsers, createUser, getUser, deleteUser, updateUser };
