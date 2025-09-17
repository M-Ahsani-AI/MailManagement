// backend/routes/bankRoutes.js
const express = require('express');
const { getBank, createBank, updateBank, deleteBank } = require('../controllers/bankController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Tambahkan log middleware
router.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

router.get('/', protect, getBank);
router.post('/', protect, createBank);
router.put('/:id', protect, updateBank);
router.delete('/:id', protect, deleteBank);

module.exports = router;