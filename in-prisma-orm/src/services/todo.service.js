const prisma = require("../../prisma/client");

const createTodo = async (datas) => {
  try {
    const { title, description, userId } = datas;
    let { status } = datas;

    if (!status) status = "DRAFT";

    const create = await prisma.todo.create({
      data: { title, description, status, userId },
    });

    return create;
  } catch (error) {
    console.error("Error creating todo:", error.message);
    throw new Error(error.message);
  }
};

const deleteTodo = async (id) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!todo) {
      throw new Error("Todo not found!");
    }

    const deleted = await prisma.todo.delete({
      where: { id: parseInt(id) },
    });

    return deleted;
  } catch (error) {
    console.error("Error deleting todo:", error.message);
    throw new Error(error.message);
  }
};

const updateTodo = async (id, data) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!todo) {
      throw new Error("Todo not found!");
    }

    const update = await prisma.todo.update({
      where: { id: parseInt(id) },
      data,
    });

    return update;
  } catch (error) {
    console.error("Error updating todo:", error.message);
    throw new Error(error.message);
  }
};

const getAllTodos = async () => {
  try {
    const todos = await prisma.todo.findMany();
    return todos;
  } catch (error) {
    console.error("Error getting all todos:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { createTodo, deleteTodo, updateTodo, getAllTodos };
