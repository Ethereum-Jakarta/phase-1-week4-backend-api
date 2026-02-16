const mongoose = require("mongoose");
const crypto = require("crypto");

const todoSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    default: () => crypto.randomUUID(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
