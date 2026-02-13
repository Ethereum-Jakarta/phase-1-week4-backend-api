import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();

router.route('/users').post(UserController.createUser).get(UserController.getAllUser);

router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.hardDeleteUser);
router.get('/users/:id', UserController.findUserByID);
router.patch('/users/:id', UserController.softDeleteUser);

export default router;
