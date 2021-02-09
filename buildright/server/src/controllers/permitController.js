const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const { getPermits } = require('../services/permitService');

// GET /api/permits?limit=24&q=residential
// The client only ever calls this route — the third-party API stays behind the server.
const listPermits = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 24, 50);
  const q = (req.query.q || '').trim();

  const { source, items, error } = await getPermits({ limit, q });
  return ok(res, { permits: items, source, ...(error ? { note: 'Showing sample data' } : {}) });
});

module.exports = { listPermits };
