const mongoose = require('mongoose')
const crypto = require('crypto')

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Properti title harus ada
      },
      description: {
        type: String,
        required: true, // Properti description harus ada
      },
      status: {
        type: String,
        required: true, // Properti status harus ada
      },
      userId: {
        type: String,
        required: true,
      },
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo;