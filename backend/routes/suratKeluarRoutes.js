// backend/routes/suratKeluarRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { createSuratKeluar, getSuratKeluar, getSuratKeluarById, deleteSuratKeluar } = require('../controllers/suratKeluarController');

const router = express.Router();

// Konfigurasi Multer untuk file Word (.doc, .docx)
const storageDir = 'uploads/surat_keluar';
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, storageDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')),
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Hanya file Word (.docx, .doc) yang diizinkan!"));
    }
});

router.post('/', protect, upload.single('file_word'), createSuratKeluar);
router.get('/', protect, getSuratKeluar);
router.get('/:id', protect, getSuratKeluarById);
router.delete('/:id', protect, deleteSuratKeluar);

module.exports = router;