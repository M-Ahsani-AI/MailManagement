// backend/routes/arsipRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getArsip, uploadArsip, deleteArsip } = require('../controllers/arsipController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Konfigurasi Multer untuk penyimpanan
const storageDir = 'uploads/arsip';
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
  },
});

const upload = multer({ storage: storage });

// Definisi Rute
router.get('/', protect, getArsip);
router.post('/', protect, upload.single('file'), uploadArsip); // 'file' adalah nama field di form
router.delete('/:id', protect, deleteArsip);

module.exports = router;