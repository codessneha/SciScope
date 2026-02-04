const { body, query, validationResult } = require('express-validator');
const logger = require('./logger');

// Validation middleware wrapper
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const message = errors.array().map(err => err.msg).join(', ');

    logger.warn(`Validation failed for ${req.originalUrl}: ${message}`);

    res.status(400).json({
      success: false,
      message,
      errors: errors.array()
    });
  };
};

// User validation rules
const userValidationRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

// Paper validation rules
const paperValidationRules = {
  search: [
    query('query').trim().notEmpty().withMessage('Search query is required'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]
};

// Chat validation rules
const chatValidationRules = {
  ask: [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('paperIds').isArray({ min: 1 }).withMessage('At least one paper ID is required')
  ],
  create: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('papers').isArray().withMessage('Papers must be an array of IDs')
  ]
};

module.exports = {
  validate,
  userValidationRules,
  paperValidationRules,
  chatValidationRules
};