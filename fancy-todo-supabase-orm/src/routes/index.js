// src/routes/index.js

const express = require('express');
const todoRoutes = require('./todo.route');
const userRoutes = require('./user.route');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Selamat datang di Fancy Todo API!');
  });
// Gunakan todoRoutes untuk menangani semua rute yang berkaitan dengan todos
router.use('/todos', todoRoutes);

// Gunakan userRoutes untuk menangani semua rute yang berkaitan dengan users
router.use('/users', userRoutes);

// Export router utama
module.exports = router;
