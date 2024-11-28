const Environment = require("../Configuration/Environment");
const TaskService = require("../Service/TaskService");

exports.createTask = (req, res) => {
  try {
    const { title, description, dueDate, userId, status } = req.body;

    if (!title || !description || !dueDate || !userId || !status) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    TaskService.createTaskService(
      { title, description, dueDate, status, userId },
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.description });
        }
        res.status(200).json({ message: "Task created successfully!" });
      }
    );
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};

exports.getTask = (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId ID is required.",
      });
    }

    TaskService.getTaskService(userId, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message || "An error occurred while fetching the task.",
        });
      }

      if (!result) {
        return res.status(404).json({
          error: "Task not found.",
        });
      }

      res.status(200).json(result);
    });
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};

exports.updateTask = (req, res) => {
  try {
    const { taskId } = req.query;
    const { title, description, dueDate, status } = req.body;

    if (!taskId) {
      return res.status(400).json({
        error: "Task ID is required.",
      });
    }

    if (!title && !description && !dueDate && !status) {
      return res.status(400).json({
        error:
          "At least one field (title, description, dueDate, or status) is required to update.",
      });
    }

    TaskService.updateTaskService(
      taskId,
      { title, description, dueDate, status },
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: err.message || "An error occurred while updating the task.",
          });
        }

        if (!result) {
          return res.status(404).json({
            error: "Task not found.",
          });
        }

        res.status(200).json({
          message: "Task updated successfully!",
        });
      }
    );
  } catch (e) {
    console.error("Unexpected error:", e);
    res.status(500).json({
      error: "An unexpected error occurred while updating the task.",
    });
  }
};

exports.deleteTask = (req, res) => {
  try {
    const { taskId } = req.query;

    if (!taskId) {
      return res.status(400).json({
        error: "Task ID is required.",
      });
    }

    TaskService.deleteTaskService(taskId, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message || "An error occurred while deleting the task.",
        });
      }

      if (!result) {
        return res.status(404).json({
          error: "Task not found.",
        });
      }

      res.status(200).json({
        message: "Task deleted successfully!",
      });
    });
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};
