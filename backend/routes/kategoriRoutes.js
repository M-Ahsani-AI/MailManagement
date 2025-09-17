// backend/routes/kategoriRoutes.js
const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getKategori, createKategori, updateKategori, deleteKategori,} = require('../controllers/kategoriController');
const router = express.Router();

// Tambahkan log middleware
router.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ✅ Gunakan /kategori (singular)
router.get('/', protect, getKategori);
router.post('/', protect, createKategori);
router.put('/:kode', protect, updateKategori);
router.delete('/:kode', protect, deleteKategori);

module.exports = router;