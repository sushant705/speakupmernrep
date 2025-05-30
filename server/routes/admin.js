const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Report = require('../models/Report');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get all reports (Admin only)
router.get('/reports', auth, async (req, res) => {
  try {
    // Build filter object from query parameters
    const filter = {};
    if (req.query.status && req.query.status !== 'All Status') {
      filter.status = req.query.status;
    }
    if (req.query.levelOfConcern && req.query.levelOfConcern !== 'All Severity') {
      filter.levelOfConcern = req.query.levelOfConcern;
    }
     if (req.query.department && req.query.department !== 'All Departments') {
      filter.department = req.query.department;
    }

    // Build sort object from query parameters (e.g., ?sort=-createdAt for newest first)
    const sort = {};
    if (req.query.sort) {
      const parts = req.query.sort.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sort.createdAt = -1; // Default sort by newest first
    }

    const reports = await Report.find(filter).sort(sort);
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single report by tracking code (Admin only)
router.get('/reports/:trackingCode', auth, async (req, res) => {
  try {
    const report = await Report.findOne({ trackingCode: req.params.trackingCode });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update report status and add admin notes (Admin only)
router.put('/reports/:trackingCode', auth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findOne({ trackingCode: req.params.trackingCode });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status || report.status; // Update status if provided
    report.adminNotes = adminNotes || report.adminNotes; // Update admin notes if provided

    await report.save();

    res.json({ message: 'Report updated successfully', report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 