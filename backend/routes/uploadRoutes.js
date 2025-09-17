const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Endpoint untuk upload file tunggal
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
  }
  // Kembalikan URL publik dari file yang diunggah
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});

module.exports = router;