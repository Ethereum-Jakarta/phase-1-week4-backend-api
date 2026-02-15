const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.route('/users')
  .post(userController.create)
  .get(userController.read);

router.put('/users/:_id', userController.update);
router.delete('/users/:_id', userController.deleted);

module.exports = router;
