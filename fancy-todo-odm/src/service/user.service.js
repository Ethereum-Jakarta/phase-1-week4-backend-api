const User = require('../models/user.model')
const mongoose = require('mongoose')
const showUsers = async () => {
    const result = await User.aggregate([
        {$lookup: {
          from: "todos",
          localField: "_id",
          foreignField: "userId",
          as: "todos"
        }}
      ])
    return result
}

const getUserById = async (id) => {
    const objectId = new mongoose.Types.ObjectId(id);
    const result = await User.aggregate([
        {
          $match: {
            _id: objectId
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
        {
            $project: {
                "todos.title": 1,
                "todos.description": 1,
                "todos.status": 1
            }
        }
      ]);

    return result
}

const createUser = async (name, email, phone) => {
    const user = await User.create({name, email, phone})

    return user
}

const updateUser = async (id, name, email, phone) => {
    const result = await User.updateOne({_id: id}, {name, email, phone})

    return result
}

const deleteUser = async (id) => {
    const result = await User.deleteOne({_id: id})

    return result
}


module.exports = {createUser, showUsers, getUserById, updateUser, deleteUser}