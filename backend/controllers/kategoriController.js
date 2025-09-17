// backend/controllers/kategoriController.js
const Kategori = require('../models/Kategori');

async function getKategori(req, res) {
  try {
    // ✅ Gunakan attributes untuk eksplisit pilih kolom
    const kategori = await Kategori.findAll({
      attributes: ['kode', 'nama_kategori', 'template', 'created_at', 'updated_at']
    });
    res.json({ success: true, data: kategori });
  } catch (err) {
    console.error('❌ Error di getKategori:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memuat data kategori',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

async function createKategori(req, res) {
  try {
    const kategori = await Kategori.create(req.body);
    res.status(201).json({ success: true, data: kategori });
  } catch (err) {
    console.error('❌ Error di createKategori:', err);
    res.status(400).json({
      success: false,
      message: 'Gagal membuat kategori',
      error: err.message,
    });
  }
}

async function updateKategori(req, res) {
  try {
    const kategori = await Kategori.findByPk(req.params.kode);
    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
    }
    await kategori.update(req.body);
    res.json({ success: true, data: kategori });
  } catch (err) {
    console.error('❌ Error di updateKategori:', err);
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui kategori',
      error: err.message,
    });
  }
}

async function deleteKategori(req, res) {
  try {
    const kategori = await Kategori.findByPk(req.params.kode);
    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
    }
    await kategori.destroy();
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error di deleteKategori:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kategori',
      error: err.message,
    });
  }
}

module.exports = { getKategori, createKategori, updateKategori, deleteKategori };