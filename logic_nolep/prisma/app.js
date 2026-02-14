const express = require("express");
const prisma = require("./prisma/client");

const app = express();
app.use(express.json());

// Endpoint untuk membuat user
app.post("/users", async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.create({
    data: { name },
  });
  res.json(user);
});

// Endpoint untuk membuat todo
app.post("/todos", async (req, res) => {
  const { title, userId } = req.body;
  const todo = await prisma.todo.create({
    data: { title, userId },
  });
  res.json(todo);
});

// Endpoint untuk mendapatkan semua todos dari user
app.get("/users/:id/todos", async (req, res) => {
  const { id } = req.params;
  const todos = await prisma.todo.findMany({
    where: { userId: Number(id) },
  });
  res.json(todos);
});

// Endpoint untuk menghapus user dan semua todos terkait
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id: Number(id) },
  });
  res.json({ message: "User  and related todos deleted" });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
