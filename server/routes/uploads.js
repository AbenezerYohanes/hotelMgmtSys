const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../database/config');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userIdSegment = (req.user && req.user.id) ? String(req.user.id) : 'public';
    const dest = path.join(__dirname, '..', 'uploads', userIdSegment);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
    cb(null, `${base}_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Upload single staff document
router.post('/staff/:employeeId/document', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const uploaderId = (req.user && req.user.id) ? String(req.user.id) : 'public';
    const filePath = `/uploads/${uploaderId}/${req.file.filename}`;

    // Save metadata to database
    await query('INSERT INTO staff_documents (employee_id, filename, path, uploaded_by) VALUES (?, ?, ?, ?)', [employeeId, req.file.originalname, filePath, req.user?.id || null]);

    res.status(201).json({ success: true, message: 'File uploaded', data: { filename: req.file.originalname, path: filePath } });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
});

// Upload invoice for booking
router.post('/bookings/:bookingId/invoice', authenticateToken, upload.single('invoice'), async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: 'No invoice uploaded' });

    const uploaderId = (req.user && req.user.id) ? String(req.user.id) : 'public';
    const filePath = `/uploads/${uploaderId}/${req.file.filename}`;

    await query('INSERT INTO invoices (booking_id, filename, path, uploaded_by) VALUES (?, ?, ?, ?)', [bookingId, req.file.originalname, filePath, req.user?.id || null]);

    res.status(201).json({ success: true, message: 'Invoice uploaded', data: { filename: req.file.originalname, path: filePath } });
  } catch (error) {
    console.error('Invoice upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading invoice' });
  }
});

module.exports = router;
