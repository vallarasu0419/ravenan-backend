const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../Configuration/Config");
const Environment = require("../Configuration/Environment");

const UserService = function () {};

UserService.registerUserService = (input, output) => {
  const { name, email, mobile, gender, password } = input;

  const checkEmailQuery = `SELECT email FROM revanan.UserCredential WHERE email = ?`;

  const insertUserQuery = `INSERT INTO revanan.UserCredential (name, email, mobile, gender, password)
                           VALUES (?, ?, ?, ?, ?)`;

  try {
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        output(
          { error: { description: Environment.SERVER_ERROR_MESSAGE } },
          null
        );
        throw err;
      }

      if (results.length > 0) {
        return output(
          {
            error: { description: "Email ID already exists." },
            statusCode: 402,
          },
          null
        );
      }

      db.query(
        insertUserQuery,
        [name, email, mobile, gender, password],
        (err, result) => {
          if (err) {
            output(
              { error: { description: Environment.SERVER_ERROR_MESSAGE } },
              null
            );
            throw err;
          }

          output(null, { message: "User registered successfully" });
        }
      );
    });
  } catch (e) {
    output({ error: { description: Environment.SERVER_ERROR_MESSAGE } }, null);
    throw e;
  }
};

UserService.loginUserService = (input, output) => {
  const { email, password } = input;

  if (!email || !password) {
    return output(
      { error: { description: "Email and password are required" } },
      null
    );
  }

  const query = `SELECT * FROM UserCredential WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      return output({ error: { description: "Database query error" } }, null);
    }

    if (results.length === 0) {
      return output(
        { error: { description: "Email ID not found", statusCode: 203 } },
        null
      );
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return output(
          { error: { description: "Error comparing passwords" } },
          null
        );
      }

      if (!isMatch) {
        return output(
          { error: { description: "Invalid password", statusCode: 406 } },
          null
        );
      }

      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        Environment.JWT_SECRET_KEY,
        { expiresIn: "240m" }
      );

      const updateQuery = `UPDATE UserCredential SET token = ? WHERE email = ?`;
      db.query(updateQuery, [token, email], (err, result) => {
        if (err) {
          return output(
            { error: { description: "Error storing token" } },
            null
          );
        }

        const response = {
          userId: user.userId,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          gender: user.gender,
          token: token,
        };

        output(null, response);
      });
    });
  });
};

module.exports = UserService;
