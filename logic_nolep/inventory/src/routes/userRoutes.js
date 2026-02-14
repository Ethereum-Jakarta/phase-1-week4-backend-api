const express = require('express');
const userController = require('../controllers/userController');
console.log('User Controller:', userController); 

const { getAllUsers, getUserById, updateUser, deleteUser } = userController;
const { authenticateToken } = require('../middlewares/auth');


const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/:userId', authenticateToken, getUserById);
router.put('/:userId', authenticateToken, updateUser);
router.delete('/:userId', authenticateToken, deleteUser);

module.exports = router;

