const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  trackingCode: {
    type: String,
    required: true,
    unique: true,
  },
  reportType: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true
  },
  levelOfConcern: {
    type: String,
    required: true
  },
  adminNotes: {
    type: String,
    default: ''
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  media: [
    {
      filename: String,
      filepath: String,
      mimetype: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema); 