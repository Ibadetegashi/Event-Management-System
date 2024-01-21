const { body } = require('express-validator');

const registerParticipantValidator = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 40 })
    .withMessage('First name must be between 2 and 40 characters'),

  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 40 })
    .withMessage('Last name must be between 2 and 40 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required'),

  body('eventId')
    .isInt({ min: 0 })
    .withMessage('Event id should be a non-negative integer'),
];

const editParticipantValidator = [
  body('firstname')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 40 })
    .withMessage('First name must be between 2 and 40 characters'),

  body('lastname')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 40 })
    .withMessage('Last name must be between 2 and 40 characters'),

  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required'),

  body('eventId')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Event id should be a non-negative integer'),
];

module.exports = { registerParticipantValidator, editParticipantValidator };
