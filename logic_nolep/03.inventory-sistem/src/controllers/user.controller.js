import UserService from '../services/user.service.js';
import bcrypt from 'bcryptjs';
import logger from '../config/logger.js';

class UserController {
  static async createUser(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await UserService.create({ name, email, password: hashedPassword });

      res.status(201).json({
        message: 'User Created Successfully',
        user,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to created user!!',
      });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
      const user = await UserService.update(id, { name, email, password });

      res.json({
        message: 'User Updated Successfully',
        user,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to updated user!!',
      });
    }
  }

  static async hardDeleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await UserService.hardDelete(id);

      res.json({
        message: `User Hard Deleted ${id} Successfully`,
        user,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to hard deleted user!!',
      });
    }
  }

  static async softDeleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await UserService.softDelete(id);

      res.json({
        message: `User Soft Deleted ${id} Successfully`,
        user,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to soft delete user!!',
      });
    }
  }

  static async getAllUser(req, res) {
    try {
      const user = await UserService.getAll();

      res.json({
        message: 'Get All Users Successfully',
        user,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to get all user!!',
      });
    }
  }

  static async findUserByID(req, res) {
    const { id } = req.params;

    try {
      const user = await UserService.findByID(id);

      res.json({
        message: `Get Detail ${id} User Successfully`,
        user,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail ${id} user`,
      });
    }
  }
}

export default UserController;
