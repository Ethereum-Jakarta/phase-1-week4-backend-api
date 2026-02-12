const express = require('express');
const userRoutes = require('./routes/user.route');
const todoRoutes = require('./routes/todo.route');

const app = express();
app.use(express.json());

// Use routes
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

module.exports = app;