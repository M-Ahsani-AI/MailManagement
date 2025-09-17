// controllers/userController.js
const User = require('../models/User');

const getUserProfil = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['uuid', 'nama', 'email', 'no_telp', 'kode', 'logo', 'npwp', 'jabatan', 'nama_penandatangan', 'tanda_tangan']
    });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil profil' });
  }
};

const updateUserProfil = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.update(req.body);
    res.json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.destroy();
    res.json({ success: true, message: 'Akun berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus akun' });
  }
};

module.exports = { getUserProfil, updateUserProfil, deleteUser };