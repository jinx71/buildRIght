const mongoose = require('mongoose');

// Single source of truth for the DB connection.
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set — check server/.env');

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
