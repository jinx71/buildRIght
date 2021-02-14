const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    category: {
      type: String,
      enum: ['residential', 'commercial', 'renovation', 'industrial'],
      required: [true, 'Category is required'],
    },
    location: { type: String, trim: true },
    year: { type: Number },
    image: { type: String }, // URL to a representative image
    description: { type: String, trim: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
