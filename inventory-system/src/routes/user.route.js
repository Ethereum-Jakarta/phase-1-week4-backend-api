const express = require('express');
const { adminAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');
const { adminRoleLocal } = require('../middlewares/checkAuth');

const router = express.Router();

router
  .route('/')
  .get(adminRoleLocal,userController.viewUser);

router
  .route('/add')
  .get(adminRoleLocal,userController.addUser)
  .post(adminRoleLocal,validate(userValidation.createUser), userController.postUser)

router
  .route('/detail/:userId')
  .get(adminRoleLocal,userController.detailUser)

router
  .route('/edit/:userId')
  .get(adminRoleLocal,userController.editUser)
  .patch(adminRoleLocal,userController.updateUser)
  .delete(adminRoleLocal,userController.deleteUser)

router
  .route('/search')
  .get(adminRoleLocal,userController.searchUser)


// router
//   .route('/')
//   .post(
//     //adminAuth(),
//      validate(userValidation.createUser), userController.createUser)
//   .get(
//     //adminAuth(),
//      userController.getUsers);

// router
//   .route('/:userId')
//   .get(
//     //adminAuth(),
//      validate(userValidation.getUser), userController.getUser)
//   .patch(
//     //adminAuth(),
//      validate(userValidation.updateUser), userController.updateUser)
//   .delete(
//     //adminAuth(),
//      validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
