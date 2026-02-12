const express = require("express");

const { Group } = require("../controllers/index");
const { getGroup, postGroup, updateGroup, deleteGroupController } = Group;

const groupRoute = express.Router();

groupRoute.get("/", getGroup);
groupRoute.post("/", postGroup);
groupRoute.put("/", updateGroup);
groupRoute.delete("/:id", deleteGroupController);

module.exports = groupRoute;
