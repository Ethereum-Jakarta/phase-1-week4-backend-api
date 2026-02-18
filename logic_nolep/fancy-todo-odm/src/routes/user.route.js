const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router
    .route('/')
    .post(userController.create)
    .get(userController.getUser)
router.put('/:name', userController.update);
router.delete('/:name', userController.delete)

module.exports = router;