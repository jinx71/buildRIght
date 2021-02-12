const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

// Verifies a `Authorization: Bearer <token>` header and attaches req.user.
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('Not authorized — user no longer exists');
  }

  req.user = user;
  return next();
});

// Role gate, e.g. requireRole('admin'). Use after `protect`.
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Forbidden — you do not have permission to do that');
  }
  return next();
};

module.exports = { protect, requireRole };
