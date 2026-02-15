const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

router.route('/todo')
  .post(todoController.create)
  .get(todoController.read);

router.put('/todo/:_id', todoController.update);
router.delete('/todo/:_id', todoController.deleted);

module.exports = router