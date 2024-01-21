const { body } = require('express-validator');

const validateRegistrationDeadline = (value) => {
  const now = new Date();
  if (value && value < now) {
    throw new Error('Registration deadline should not be in the past');
  }
  return true;
};

const createEventValidator = [
  body('name')
    .trim().notEmpty()
    .withMessage('Name of event is required')
    .isLength({ max: 50, min: 4 })
    .withMessage('Name of event must be between 4 and 50 characters'),

  body('startTime')
    .isISO8601()
    .toDate()
    .withMessage('Invalid start time'),

  body('endTime')
    .isISO8601()
    .toDate()
    .withMessage('Invalid end time'),

  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 50, min: 2 })
    .withMessage('Location of event must be between 2 and 50 characters'),

  body('description')
    .optional()
    .isLength({ max: 600 })
    .withMessage('Description should be at most 600 characters'),

  body('availableSeats')
    .isInt({ min: 1 })
    .withMessage('Available Seats should be a positive integer and at least 1'),

  body('registrationDeadline')
    .isISO8601()
    .toDate()
    .withMessage('Invalid registration deadline')
    .custom(validateRegistrationDeadline),
];

const editEventValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name of event is required')
    .isLength({ max: 50, min: 4 })
    .withMessage('Name of event must be between 4 and 50 characters'),

  body('startTime')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid start time'),

  body('endTime')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid end time'),

  body('location')
    .optional()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 50, min: 2 })
    .withMessage('Location of event must be between 2 and 50 characters'),

  body('description')
    .optional()
    .isLength({ max: 600 })
    .withMessage('Description should be at most 600 characters'),

  body('availableSeats')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Available Seats should be a positive integer and at least 1'),

  body('registrationDeadline')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid registration deadline')
    .custom(validateRegistrationDeadline),
];

module.exports = { createEventValidator, editEventValidator };
