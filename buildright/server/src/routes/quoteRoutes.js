const express = require('express');
const { body } = require('express-validator');
const {
  createQuote,
  getQuotes,
  updateQuoteStatus,
  deleteQuote,
} = require('../controllers/quoteController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Server-side validation — never trust the client alone.
const quoteRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim(),
  body('projectType')
    .isIn(['residential', 'commercial', 'renovation', 'industrial', 'other'])
    .withMessage('Please choose a project type'),
  body('budget').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('squareMeters').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Area must be a positive number'),
  body('message').optional({ checkFalsy: true }).isLength({ max: 2000 }).withMessage('Message is too long'),
];

// Public
router.post('/', quoteRules, createQuote);

// Admin only
router.get('/', protect, requireRole('admin', 'staff'), getQuotes);
router.patch('/:id/status', protect, requireRole('admin', 'staff'), updateQuoteStatus);
router.delete('/:id', protect, requireRole('admin'), deleteQuote);

module.exports = router;
