const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: { type: String, trim: true },
    projectType: {
      type: String,
      enum: ['residential', 'commercial', 'renovation', 'industrial', 'other'],
      required: [true, 'Project type is required'],
    },
    budget: { type: Number, min: [0, 'Budget cannot be negative'] },
    squareMeters: { type: Number, min: [0, 'Area cannot be negative'] },
    message: { type: String, trim: true, maxlength: [2000, 'Message is too long'] },
    // Admin workflow state for the dashboard.
    status: {
      type: String,
      enum: ['new', 'reviewed', 'won', 'lost'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);
