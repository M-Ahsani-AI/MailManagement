const express = require('express');
const router = express.Router();
const { getSurat, createSurat, updateSurat, deleteSurat, getSuratById, verifySuratById } = require('../controllers/suratController');
const { protect } = require('../middleware/authMiddleware');

router.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// Rute yang dilindungi (butuh login)
router.route('/')
                .get(protect, getSurat)
                .post(protect, createSurat);
router.route('/:id')
                .get(protect, getSuratById)
                .put(protect, updateSurat)
                .delete(protect, deleteSurat);
router.get('/verify/:id', verifySuratById);

module.exports = router;