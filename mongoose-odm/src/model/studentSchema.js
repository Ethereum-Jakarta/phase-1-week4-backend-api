const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
	StudentId: Number,
	Name: String,
	Roll: Number,
	Birthday: Date,
	Address: String
});

module.exports = mongoose.model(
	'student', StudentSchema, 'Students');
