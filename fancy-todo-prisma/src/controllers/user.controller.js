const userService = require("../service/user.service");


const getUsers = async(req, res) => {
  try {
    const result = await userService.getUsers();
    res.status(200).send({
      status: 200,
      message: "Get users Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const getUser = async(req, res) => {
  try {
    const id = req.params.id;
    const result = await userService.getUser(id);
    res.status(200).send({
      status: 200,
      message: "Get user Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const createUser = async (req, res) => {
  try {
    const {name, email, phone} = req.body;
    const result = await userService.createUser(name, email, phone);
    res.status(200).send({
      status: 200,
      message: "Create User Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const {name, email, phone} = req.body;
    const id = req.params.id
    const result = await userService.updateUser(name, email, phone, id);
    res.status(200).send({
      status: 200,
      message: "Update User Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    const result = await userService.deleteUser(id);
    res.status(200).send({
      status: 200,
      message: "Delete User Success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { createUser, getUsers, getUser , updateUser, deleteUser};

