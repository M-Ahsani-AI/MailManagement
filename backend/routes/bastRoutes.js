// backend/routes/bastRoutes.js
const express = require('express');
const router = express.Router();
const { getBast, createBast, updateBast, deleteBast, getBastById, verifyBastById } = require('../controllers/bastController');
const { protect } = require('../middleware/authMiddleware');

router.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// Rute yang dilindungi (butuh login)
router.route('/')
                .get(protect, getBast)
                .post(protect, createBast);
router.route('/:id')
                .get(protect, getBastById)
                .put(protect, updateBast)
                .delete(protect, deleteBast);
router.get('/verify/:id', verifyBastById);

module.exports = router;