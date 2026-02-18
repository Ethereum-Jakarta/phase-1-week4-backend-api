const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router
    .route('/')
    .post(userController.create)
    .get(userController.getUser)
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;