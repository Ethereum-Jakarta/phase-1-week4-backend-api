const service = require('../services/user.service');

const create = async (req, res) => {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json({ code: 201, message: 'OK', data: user });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const read = async (req, res) => {
  try {
    const user = await service.readUser();
    if (user.length > 0) {
      res.status(201).json({ code: 201, message: 'OK', data: user });
    } else {
      res.status(404).json({ code: 404, message: 'Not Found', data: user });
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const update = async (req, res) => {
  try {
    const user = await service.updateUser(Number(req.params._id), req.body);
    res.status(201).json({ code: 201, message: 'OK', data: user });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const deleted = async (req, res) => {
  try {
    const user = await service.deleteUser(Number(req.params._id));
    res.status(201).json({ code: 201, message: 'OK', data: user });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

module.exports = { create, read, update, deleted };
