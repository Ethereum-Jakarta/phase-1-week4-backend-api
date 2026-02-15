const service = require('../service/todo.service');

const create = async (req, res) => {
  try {
    const todo = await service.createTodo(req.body);
    res.status(201).json({ code: 201, message: 'Created', data: todo });
  } catch (error) {
    res
      .status(400)
      .json({ code: 400, message: 'Bad Request', error: error.name });
  }
};

const read = async (req, res) => {
  try {
    const populateOptions = { path: 'user', select: 'name email age -_id' };
    const todo = await service.readTodo(populateOptions);

    if (todo.length > 0) {
      res.status(200).json({ code: 200, message: 'OK', data: todo });
    } else {
      res.status(404).json({ code: 404, message: 'Not Found', data: todo });
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const update = async (req, res) => {
  try {
    const { _id } = req.params;
    const query = { _id: _id };
    const todo = await service.updateTodo(query, req.body);
    res.status(200).json({ code: 200, message: 'OK', data: todo });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

const deleted = async (req, res) => {
  try {
    const { _id } = req.params;
    const id = { _id: _id };
    const todo = await service.deleteTodo(id);
    res.status(200).json({ code: 200, message: 'OK', data: todo });
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Bad Request', error: error });
  }
};

module.exports = { create, read, update, deleted };
