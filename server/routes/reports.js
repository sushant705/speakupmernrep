const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Use a unique filename to prevent conflicts
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Create the multer upload middleware
// 'media' is the name of the form field for file uploads
const upload = multer({ storage: storage });

// Helper function to generate a unique tracking code
const generateTrackingCode = async () => {
  let code;
  let isUnique = false;
  while (!isUnique) {
    // Generate a 10-character alphanumeric code
    code = crypto.randomBytes(5).toString('hex');
    const existingReport = await Report.findOne({ trackingCode: code });
    if (!existingReport) {
      isUnique = true;
    }
  }
  return code;
};

// Submit a new report
// Use upload.array('media', 5) for multiple file uploads (up to 5 files)
// Or upload.single('media') for a single file upload
router.post('/', upload.array('media', 5), async (req, res) => {
  try {
    const trackingCode = await generateTrackingCode();
    const {
      department,
      reportType,
      issue,
      companyName,
      levelOfConcern,
      additionalInfo,
    } = req.body;

    // Process uploaded files if any
    const mediaFiles = req.files ? req.files.map(file => ({
      filename: file.filename,
      filepath: file.path, // path where the file is stored
      mimetype: file.mimetype,
    })) : [];

    const newReport = new Report({
      trackingCode,
      department,
      reportType,
      issue,
      companyName,
      levelOfConcern,
      additionalInfo,
      media: mediaFiles, // Save media file information
    });

    await newReport.save();

    res.status(201).json({ trackingCode: newReport.trackingCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get report status by tracking code (for public tracking page)
router.get('/:trackingCode', async (req, res) => {
  try {
    const report = await Report.findOne({ trackingCode: req.params.trackingCode });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    // Only return necessary public fields
    res.json({
      trackingCode: report.trackingCode,
      status: report.status,
      levelOfConcern: report.levelOfConcern,
      updatedAt: report.updatedAt,
       // Do NOT include sensitive info like issue, department, media here
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 