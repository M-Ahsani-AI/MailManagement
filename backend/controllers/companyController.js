// backend/controllers/companyController.js
const Company = require('../models/Company');
const { v4: uuidv4 } = require('uuid');

const generateUUID = () => uuidv4().replace(/-/g, '').slice(0, 10);

// GET all companies (admin role 1 bisa lihat semua)
exports.getAllCompanies = async (req, res) => {
  try {
    const user = req.user;
    let companies;

    if (user.role_id === 1) {
      // Admin: lihat semua
      companies = await Company.findAll();
    } else {
      // User biasa: hanya punya sendiri
      companies = await Company.findAll({ where: { id: user.company_id } });
    }

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Perusahaan tidak ditemukan' });
    }

    const user = req.user;
    if (user.role_id !== 1 && company.id !== user.company_id) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
exports.createCompany = async (req, res) => {
  const { nama_cv, logo, biografi, tahun_berdiri } = req.body;
  try {
    const company = await Company.create({
      id,
      nama_cv,
      logo,
      biografi,
      tahun_berdiri,
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const { nama_cv, logo, biografi, tahun_berdiri } = req.body;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Perusahaan tidak ditemukan' });
    }

    await company.update({ nama_cv, logo, biografi, tahun_berdiri });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Perusahaan tidak ditemukan' });
    }

    await company.destroy();
    res.json({ message: 'Perusahaan dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};