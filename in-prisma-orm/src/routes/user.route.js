const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("@controllers/user-controller");



router.route("/user").get(getAllUsers).post(createUser);
router.route('/user/:id').get(getUserById).put(updateUser).delete(deleteUser)

module.exports = router