// Catches any request that didn't match a route and hands it to errorHandler.
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
