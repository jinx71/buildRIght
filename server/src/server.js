require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const projectRoutes = require('./routes/projectRoutes');
const permitRoutes = require('./routes/permitRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & parsing ──────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Rate limit our own API ──────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please slow down', errors: [] },
});
app.use('/api', apiLimiter);

// ── Health check ────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } })
);

// ── Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/permits', permitRoutes);

// ── 404 + central error handler (must be last) ──
app.use(notFound);
app.use(errorHandler);

// ── Start ───────────────────────────────────────
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🏗️  BuildRight API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
