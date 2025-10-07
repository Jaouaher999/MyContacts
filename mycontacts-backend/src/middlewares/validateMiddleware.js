const { body, validationResult } = require("express-validator");

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const registerValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const createContactValidator = [
  body("firstName").optional().notEmpty().withMessage("First name is required"),
  body("lastName").optional().notEmpty().withMessage("Last name is required"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .matches(/^(?:\+\d{7,15}|0\d{7,15})$/)
    .withMessage("Invalid phone number"),
];

const updateContactValidator = [
  body("firstName").optional().notEmpty().withMessage("First name is required"),
  body("lastName").optional().notEmpty().withMessage("Last name is required"),
  body("phone")
    .optional()
    .matches(/^(?:\+\d{7,15}|0\d{7,15})$/)
    .withMessage("Invalid phone number"),
];

module.exports = {
  runValidation,
  registerValidator,
  loginValidator,
  createContactValidator,
  updateContactValidator,
};
