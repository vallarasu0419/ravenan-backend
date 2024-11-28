const express = require("express");
const userController = require("../Controller/UserController");
const TaskController = require("../Controller/TaskController");
const { Middleware } = require("../Util/Middleware");

const router = express.Router();

// USER
router.post("/registerUser", userController.registerUser);
router.post("/loginUser", userController.loginUser);

//TASK
router.post("/createTask", Middleware, TaskController.createTask);
router.get("/getTask", Middleware, TaskController.getTask);
router.put("/updateTask", Middleware, TaskController.updateTask);
router.delete("/deleteTask", Middleware, TaskController.deleteTask);

module.exports = router;
