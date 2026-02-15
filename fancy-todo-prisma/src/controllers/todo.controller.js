const service = require('../services/todo.service');

const create = async (req, res) => {
  try {
    const todo = await service.createTodo(req.body);
    res.status(201).json({ code: 201, message: 'Created', data: todo });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const read = async (req, res) => {
  try {
    const todo = await service.readTodo();
    if (todo.length > 0) {
      res.status(201).json({ code: 200, message: 'OK', data: todo });
    } else {
      res.status(404).json({ code: 404, message: 'Not Found', data: todo });
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const update = async (req, res) => {
  try {
    const todo = await service.updateTodo(Number(req.params._id), req.body);
    res.status(201).json({ code: 200, message: 'OK', data: todo });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error.meta.cause });
  }
};

const deleted = async (req, res) => {
  try {
    const todo = await service.deleteTodo(Number(req.params._id));
    res.status(201).json({ code: 200, message: 'OK', data: todo });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error.meta.cause });
  }
};

module.exports = { create, read, update, deleted };
