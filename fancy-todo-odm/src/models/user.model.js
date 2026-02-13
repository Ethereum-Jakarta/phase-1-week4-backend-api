const mongoose = require('mongoose')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type : String,
        unique: true,
        required : true
    },
    phone: {
        type : String,
        required : true,
        unique: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User