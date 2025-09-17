// routes/companyRoutes.js
const express = require('express');
const Company = require('../models/Company');

const router = express.Router();

// GET /api/companies/:id
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Perusahaan tidak ditemukan' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Gagal mengambil data perusahaan' });
  }
});

module.exports = router;