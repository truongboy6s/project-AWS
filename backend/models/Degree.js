const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  coefficient: {
    type: Number,
    required: true,
    min: 0
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Degree', degreeSchema);
