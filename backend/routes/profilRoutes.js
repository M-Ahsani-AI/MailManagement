const express = require('express');
const router = express.Router();
const { getProfil, createProfil, updateProfil, deleteProfil } = require('../controllers/profilController');
const { protect } = require('../middleware/authMiddleware');

router.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

router.use(protect);
router.get('/', getProfil);
router.post('/', createProfil);
router.put('/:id', updateProfil);
router.delete('/:id', deleteProfil);

module.exports = router;
