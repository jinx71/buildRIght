const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
// Open for first-time setup convenience; in production lock this down or use the seed script.
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 'Validation failed', 400, errors.array().map((e) => e.msg));

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return fail(res, 'An account with that email already exists', 409);

  const user = await User.create({ name, email, password, role: 'admin' });
  const token = generateToken(user._id);
  return ok(res, { token, user: sanitize(user) }, 'Account created', 201);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 'Validation failed', 400, errors.array().map((e) => e.msg));

  const { email, password } = req.body;
  // Need the hash for comparison, so explicitly select it back in.
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return fail(res, 'Invalid email or password', 401);
  }

  const token = generateToken(user._id);
  return ok(res, { token, user: sanitize(user) }, 'Signed in');
});

// GET /api/auth/me  (protected)
const getMe = asyncHandler(async (req, res) => ok(res, { user: sanitize(req.user) }));

module.exports = { register, login, getMe };
