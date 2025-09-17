const express = require('express');
const { getPembayarans, createPembayaran, updatePembayaran, deletePembayaran } = require('../controllers/pembayaranController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPembayarans);
router.post('/', protect, createPembayaran);
router.put('/:uuid', protect, admin, updatePembayaran);
router.delete('/:uuid', protect, admin, deletePembayaran);

module.exports = router;