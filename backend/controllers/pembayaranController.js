const Pembayaran = require('../models/Pembayaran');
const { v4: uuidv4 } = require('uuid');

const generateUUID = () => uuidv4().replace(/-/g, '').slice(0, 10);

const getPembayarans = async (req, res) => {
  try {
    const pembayarans = await Pembayaran.findAll();
    res.json(pembayarans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPembayaran = async (req, res) => {
  const { id_kategori, id_user, id_bank, tahun, nomor, id_sp, isi_pembayaran } = req.body;
  try {
    const pembayaran = await Pembayaran.create({
      uuid: generateUUID(),
      id_kategori,
      id_user,
      id_bank,
      tahun,
      nomor,
      id_sp,
      isi_pembayaran,
    });
    res.status(201).json(pembayaran);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePembayaran = async (req, res) => {
  const { uuid } = req.params;
  const { id_kategori, id_user, id_bank, tahun, nomor, id_sp, isi_pembayaran } = req.body;
  try {
    const pembayaran = await Pembayaran.findByPk(uuid);
    if (!pembayaran) {
      return res.status(404).json({ message: 'Pembayaran not found' });
    }
    await pembayaran.update({ id_kategori, id_user, id_bank, tahun, nomor, id_sp, isi_pembayaran });
    res.json(pembayaran);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePembayaran = async (req, res) => {
  const { uuid } = req.params;
  try {
    const pembayaran = await Pembayaran.findByPk(uuid);
    if (!pembayaran) {
      return res.status(404).json({ message: 'Pembayaran not found' });
    }
    await pembayaran.destroy();
    res.json({ message: 'Pembayaran deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPembayarans, createPembayaran, updatePembayaran, deletePembayaran };