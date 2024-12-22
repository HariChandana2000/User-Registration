const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware for user registration validation
app.post(
  "/register",
  [
    check("firstName")
      .custom((value) => /^[A-Z]/.test(value))
      .withMessage("First name must start with a capital letter."),
    check("lastName")
      .custom((value) => /^[A-Z]/.test(value))
      .withMessage("Last name must start with a capital letter."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/\d/)
      .withMessage("Password must contain at least one numeric character.")
      .matches(/[!@#\$%\^\&*\)\(+=._-]/)
      .withMessage("Password must contain at least one special character."),
    check("email").isEmail().withMessage("Invalid email address."),
    check("phoneNumber")
      .isLength({ min: 10 })
      .withMessage("Phone number must be at least 10 digits long."),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, errors: errors.array() });
    }
    res.status(200).json({ message: "User registered successfully!" });
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ errors: err.errors });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
