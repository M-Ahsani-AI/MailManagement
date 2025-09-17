// backend/routes/authRoutes.js
const express = require('express');
const { register, login, upload, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Pastikan 'protect' diimpor

const router = express.Router();

// Route untuk register user baru
router.post('/register', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'tanda_tangan', maxCount: 1 }
]), register);

// Route untuk login
router.post('/login', login);

// ✅ RUTE BARU: Untuk mendapatkan data user yang sedang login
router.get('/me', protect, getMe);

module.exports = router;