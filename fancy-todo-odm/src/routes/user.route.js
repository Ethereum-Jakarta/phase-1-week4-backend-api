const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller")

router
    .route('/')
    .get(userController.getUsers)
    .post(userController.createUser)

router
    .route('/:userId')
    .get(userController.findUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)
module.exports = router;