const mysql = require("mysql");
const Environment = require("./Environment");

const db = mysql.createPool({
  host: Environment.DATABASEHOST,
  user: Environment.DBUSERNAME,
  password: Environment.DBPASSWORD,
  database: Environment.DATABASENAME,
  port: Environment.DATABASEPORT,
  multipleStatements: true,
  connectionLimit: 20,
  queueLimit: 5,
});

let createUserCredential = `CREATE TABLE IF NOT EXISTS UserCredential (
  userId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  gender VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255),
  PRIMARY KEY (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

let createTask = `CREATE TABLE IF NOT EXISTS Task (
  taskId INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  dueDate DATE,
  status VARCHAR(255) NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (taskId),
  FOREIGN KEY (userId) REFERENCES UserCredential(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

console.log("Connected!");

try {
  db.query(createUserCredential, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });
  db.query(createTask, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });
} catch (e) {
  console.log(e);
  throw e;
}

module.exports = db;
