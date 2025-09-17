// backend/routes/invoiceRoutes.js
const express = require('express');
const { getInvoice, createInvoice, updateInvoice, deleteInvoice, getInvoiceById, verifyInvoiceById } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`📥 INVOICE: ${req.method} ${req.path}`);
    next();
});

// Rute yang memerlukan otentikasi
router.route('/')
    .get(protect, getInvoice)
    .post(protect, createInvoice);

router.route('/:id')
    .get(protect, getInvoiceById)
    .put(protect, updateInvoice)
    .delete(protect, deleteInvoice);

// ✅ BARU: Rute publik untuk verifikasi QR Code
router.get('/verify/:id', verifyInvoiceById);

module.exports = router;