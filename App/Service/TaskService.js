const db = require("../Configuration/Config");
const Environment = require("../Configuration/Environment");

exports.createTaskService = (taskData, output) => {
  const { title, description, dueDate, status, userId } = taskData;

  const query = `INSERT INTO task (title, description, dueDate, status, userId) VALUES (?, ?, ?, ?, ?)`;

  db.query(
    query,
    [title, description, dueDate, status, userId],
    (err, result) => {
      if (err) {
        return output(
          { error: { description: Environment.SERVER_ERROR_MESSAGE } },
          null
        );
      }

      output(null, {
        taskId: result.insertId,
        title,
        description,
        dueDate,
        status,
        userId,
      });
    }
  );
};

exports.getTaskService = (userId, output) => {
  const query = `SELECT * FROM task WHERE userId = ?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      return output(
        { error: { description: Environment.SERVER_ERROR_MESSAGE } },
        null
      );
    }

    if (result.length === 0) {
      return output(null, null);
    }

    output(null, result);
  });
};

exports.updateTaskService = (taskId, taskData, output) => {
  const { title, description, dueDate, status } = taskData;

  let query = `UPDATE task SET title = ?, description = ?, dueDate = ?, status = ? WHERE taskId = ?`;

  db.query(
    query,
    [title, description, dueDate, status, taskId],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return output(
          { error: { description: "Database error: " + err.message } },
          null
        );
      }
      if (result.affectedRows === 0) {
        return output(null, null);
      }
      output(null, { taskId, ...taskData });
    }
  );
};

exports.deleteTaskService = (taskId, output) => {
  const query = `DELETE FROM task WHERE taskId = ?`;

  db.query(query, [taskId], (err, result) => {
    if (err) {
      return output(
        { error: { description: Environment.SERVER_ERROR_MESSAGE } },
        null
      );
    }

    if (result.affectedRows === 0) {
      return output(null, null);
    }

    output(null, { taskId });
  });
};
