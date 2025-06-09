const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

// PUBLIC_INTERFACE
// POST /api/reports - Create a new report
router.post('/', async (req, res) => {
  // TODO: Validate inputs properly
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUBLIC_INTERFACE
// GET /api/reports - Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort('-createdAt');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC_INTERFACE
// PATCH /api/reports/:id/status - Update status of a report
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Reported', 'In Progress', 'Fixed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUBLIC_INTERFACE
// POST /api/upload - Placeholder for photo upload (Cloudinary integration)
router.post('/upload', async (req, res) => {
  // TODO: Integrate with Cloudinary (parse file from req, upload, return URL)
  res.status(501).json({ error: 'Cloudinary photo upload not implemented.' });
});

module.exports = router;
