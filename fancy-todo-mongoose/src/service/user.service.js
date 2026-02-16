const User = require("../models/user.model");
const Todo = require("../models/todo.model");

const getUsers = async () => {
  const userWithTodos = await User.aggregate([
    {$lookup: {
      from: "todos",
      localField: "_id",
      foreignField: "userId",
      as: "todos"
    }}
  ])

  return userWithTodos;
};

const getUser = async (_id) => {
  const userWithTodos = await User.aggregate([
    {
      $match: {
        _id
      },
    },
    {
      $lookup: {
        from: "todos",
        localField: "_id",
        foreignField: "userId",
        as: "todos",
      },
    },
  ]);

  return userWithTodos;
};

const createUser = async (name, email, phone) => {
  const user = await User.create({ name, email, phone });
  return user;
};

const updateUser = async (name, email, phone, _id) => {
  const user = await User.updateOne({ _id }, { name, email, phone });
  return user;
};

const deleteUser = async (_id) => {
  const user = await User.deleteOne({_id});

  // Temukan dan hapus semua todos dengan userId yang sesuai
  await Todo.deleteMany({ userId: _id });

  return user;
};


module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
