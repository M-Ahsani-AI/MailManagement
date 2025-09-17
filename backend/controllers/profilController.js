// controllers/profilController.js
const Profil = require('../models/Profil');

async function getProfil(req, res) {
  try {
    const profil = await Profil.findAll({
      where: { user_id: req.user.id }
    });
    res.json({ success: true, data: profil });
  } catch (err) {
    console.error('❌ Error di getProfil:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memuat data profil',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

async function createProfil(req, res) {
  try {
    const profilData = req.body;
    const userId = req.user.id;
    const dataToSave = { ...profilData, user_id: userId };

    const profil = await Profil.create(dataToSave);
    res.status(201).json({ success: true, data: profil });
  } catch (err) {
    console.error('❌ Error di createProfil:', err);
    res.status(400).json({
      success: false,
      message: 'Gagal membuat profil',
      error: err.message,
    });
  }
}

async function updateProfil(req, res) {
  try {
    const profil = await Profil.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id
        }
    });

    if (!profil) {
      return res.status(404).json({
        success: false,
        message: 'Profil tidak ditemukan atau Anda tidak punya akses', // Pesan lebih aman
      });
    }

    await profil.update(req.body);
    res.json({ success: true, data: profil });
  } catch (err) {
    console.error('❌ Error di updateProfil:', err);
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui profil',
      error: err.message,
    });
  }
}

async function deleteProfil(req, res) {
  try {
    const profil = await Profil.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id
        }
    });

    if (!profil) {
      return res.status(404).json({
        success: false,
        message: 'Profil tidak ditemukan atau Anda tidak punya akses', // Pesan lebih aman
      });
    }

    await profil.destroy();
    res.json({ success: true, message: 'Profil berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error di deleteProfil:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus profil',
      error: err.message,
    });
  }
}

module.exports = { getProfil, createProfil, updateProfil, deleteProfil };