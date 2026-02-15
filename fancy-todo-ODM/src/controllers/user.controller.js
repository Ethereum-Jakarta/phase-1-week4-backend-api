const service = require('../service/user.service');

const create = async (req, res) => {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json({ code: 201, message: 'Created', data: user });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const read = async (req, res) => {
  try {
    const user = await service.getAllUsers();
    if (user.length > 0) {
      res.status(200).json({ code: 200, message: 'OK', data: user });
    } else {
      res.status(404).json({ code: 404, message: 'Data not found' });
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const update = async (req, res) => {
  try {
    const { _id } = req.params;
    const filter = { _id: _id };
    const user = await service.updateUser(filter, req.body);
    res.status(200).json({ code: 200, message: 'OK', data: user });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const deleted = async (req, res) => {
  try {
    const { _id } = req.params;
    const filter = { _id: _id };
    const user = await service.deleteUser(filter);
    res.status(200).json({ code: 200, message: 'OK', data: user });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

module.exports = { create, read, update, deleted };
