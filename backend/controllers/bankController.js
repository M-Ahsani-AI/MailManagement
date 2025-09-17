// backend/controllers/bankController.js
const Bank = require('../models/Bank');

async function getBank(req, res) {
  try {
    const bank = await Bank.findAll({
      attributes: ['id', 'nama_bank', 'nomor_rekening', 'nama_pemilik', 'profil_id', 'created_at', 'updated_at']
    });
    res.json({ success: true, data: bank });
  } catch (err) {
    console.error('❌ Error di getBank:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memuat data bank',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

async function createBank(req, res) {
  try {
    const bank = await Bank.create(req.body);
    res.status(201).json({ success: true, data: bank });
  } catch (err) {
    console.error('❌ Error di createBank:', err);
    res.status(400).json({
      success: false,
      message: 'Gagal membuat bank',
      error: err.message,
    });
  }
}

async function updateBank(req, res) {
  try {
    const bank = await Bank.findByPk(req.params.id);
    if (!bank) {
      return res.status(404).json({
        success: false,
        message: 'Bank tidak ditemukan',
      });
    }
    await bank.update(req.body);
    res.json({ success: true, data: bank });
  } catch (err) {
    console.error('❌ Error di updateBank:', err);
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui bank',
      error: err.message,
    });
  }
}

async function deleteBank(req, res) {
  try {
    const bank = await Bank.findByPk(req.params.id);
    if (!bank) {
      return res.status(404).json({
        success: false,
        message: 'Bank tidak ditemukan',
      });
    }
    await bank.destroy();
    res.json({ success: true, message: 'Bank berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error di deleteBank:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus bank',
      error: err.message,
    });
  }
}

module.exports = { getBank, createBank, updateBank, deleteBank };