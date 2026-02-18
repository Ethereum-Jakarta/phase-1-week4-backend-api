const express = require('express');
const router = express.Router();
const todoController = require('../controller/todo.controller');

router
    .route('/')
    .post(todoController.create)
    .get(todoController.getTodo)
router.put('/:_id', todoController.update);
router.delete('/:_id', todoController.delete)

module.exports = router;