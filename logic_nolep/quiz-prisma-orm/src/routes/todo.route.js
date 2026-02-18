const todoController = require('../controller/todo.controller');
const express = require('express');
const router = express.Router();

router
    .route('/')
    .post(todoController.create)
    .get(todoController.getTodo)
router.put('/:id', todoController.update);
router.delete('/:id', todoController.delete);

module.exports = router;