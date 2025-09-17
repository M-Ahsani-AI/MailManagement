// backend/routes/kwitansiRoutes.js
const express = require('express');
const { getKwitansi, createKwitansi, updateKwitansi, deleteKwitansi, getKwitansiById, verifyKwitansiById } = require('../controllers/kwitansiController'); 
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();

router.route('/')
  .get(protect, getKwitansi)
  .post(protect, createKwitansi);

router.route('/:id')
  .get(protect, getKwitansiById)
  .put(protect, updateKwitansi)
  .delete(protect, deleteKwitansi);

// Rute publik untuk verifikasi
router.get('/verify/:id', verifyKwitansiById);

module.exports = router;