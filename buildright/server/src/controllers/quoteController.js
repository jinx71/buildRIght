const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');
const Quote = require('../models/Quote');
const { sendQuoteEmail } = require('../services/emailService');

// POST /api/quotes  (public) — saves the lead AND emails the firm.
const createQuote = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 'Validation failed', 400, errors.array().map((e) => e.msg));

  const quote = await Quote.create(req.body);

  // Fire the email but don't let a mail hiccup fail the request — the lead is saved.
  const mail = await sendQuoteEmail(quote);

  return ok(
    res,
    { quote, emailed: mail.delivered },
    'Thanks — your request has been received. We’ll be in touch shortly.',
    201
  );
});

// GET /api/quotes  (admin) — supports ?status=new
const getQuotes = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const quotes = await Quote.find(filter).sort({ createdAt: -1 });
  return ok(res, { quotes, count: quotes.length });
});

// PATCH /api/quotes/:id/status  (admin)
const updateQuoteStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'reviewed', 'won', 'lost'];
  if (!allowed.includes(status)) return fail(res, 'Invalid status value', 400);

  const quote = await Quote.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!quote) return fail(res, 'Quote not found', 404);
  return ok(res, { quote }, 'Status updated');
});

// DELETE /api/quotes/:id  (admin)
const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);
  if (!quote) return fail(res, 'Quote not found', 404);
  return ok(res, null, 'Quote deleted');
});

module.exports = { createQuote, getQuotes, updateQuoteStatus, deleteQuote };
