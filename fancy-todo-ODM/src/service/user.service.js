const User = require('../models/user.model');

const createUser = async (document) => {
  try {
    const user = new User(document);
    return await user.save();
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const user = await User.find();
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (query, update) => {
  try {
    const user = await User.updateOne(query, update);
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (query) => {
  try {
    const user = await User.deleteOne(query);
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, getAllUsers, updateUser, deleteUser };
