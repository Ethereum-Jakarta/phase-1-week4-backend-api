const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

router.route('/todos')
  .post(todoController.create)
  .get(todoController.read);

router.put('/todos/:_id', todoController.update);
router.delete('/todos/:_id', todoController.deleted);

module.exports = router;
