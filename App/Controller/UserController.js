const bcrypt = require("bcrypt");
const Environment = require("../Configuration/Environment");
const UserService = require("../Service/UserService");

exports.registerUser = (req, res) => {
  try {
    const { name, email, mobile, gender, password } = req.body;

    if (!name || !email || !mobile || !gender || !password) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({
          error: "Error while hashing password",
        });
      }

      UserService.registerUserService(
        { name, email, mobile, gender, password: hashedPassword },
        (err, result) => {
          if (err) {
            if (err.statusCode === 402) {
              return res.status(402).json({ error: err.description });
            }
            return res.status(500).json({ error: err.description });
          }
          res.status(200).json({ message: "User registered successfully!" });
        }
      );
    });
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};

exports.loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    UserService.loginUserService({ email, password }, (err, result) => {
      if (err) {
        const statusCode = err?.error?.statusCode;
        return res.status(statusCode).json({
          error: err.description || "Something went wrong",
        });
      }

      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }
    });
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};
