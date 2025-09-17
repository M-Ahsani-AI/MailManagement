// routes/userRoutes.js
const express = require('express');
const { getUserProfil, updateUserProfil, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getUserProfil);
router.put('/profile', protect, updateUserProfil);
router.delete('/profile', protect, deleteUser);

module.exports = router;