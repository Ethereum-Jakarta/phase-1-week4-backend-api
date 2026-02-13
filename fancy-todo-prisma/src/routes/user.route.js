const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUser,
    getUserTodos,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/user.controller.js");

router.route("/")
    .get(getUsers)
    .post(createUser);

router.route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.route("/:id/todos")
    .get(getUserTodos);

module.exports = router;