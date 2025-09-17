const { Op, Sequelize } = require('sequelize');
const User = require('../models/User');
const Surat = require('../models/Surat');
const Profil = require('../models/Profil');
const Kategori = require('../models/Kategori');
const QRCode = require('qrcode'); 

function toRoman(num) {
  const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let str = '';
  for (let i of Object.keys(roman)) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str;
}

async function getSurat(req, res) {
  try {
    const surat = await Surat.findAll({
      where: { user_id: req.user.uuid },
      include: [{ model: Profil, as: 'profil' }, { model: Kategori, as: 'kategori' }],
      order: [['tanggal', 'DESC']]
    });
    res.json({ success: true, data: surat });
  } catch (err) {
    console.error('❌ Error di getSurat:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat data surat' });
  }
}

async function createSurat(req, res) {
  try {
    const { tanggal, isi, kategori_kode, profil_id, meta_data } = req.body;
    const userId = req.user.uuid; 

    if (!tanggal || !kategori_kode || !profil_id) {
      return res.status(400).json({ success: false, message: 'Tanggal, kategori, dan profil wajib diisi.' });
    }

    const kategori = await Kategori.findOne({ where: { kode: kategori_kode } });
    if (!kategori) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    
    const perihal = kategori.nama_kategori;

    const user = await User.findOne({ where: { uuid: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

    const userKode = user.kode;

    const date = new Date(tanggal);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const count = await Surat.count({
      where: {
        user_id: userId,
        kategori_kode: kategori_kode, 
        [Op.and]: [
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('tanggal')), year),
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('tanggal')), month),
        ]
      }
    });

    const sequence = (count + 1).toString().padStart(3, '0');
    const romanMonth = toRoman(month);
    const no_surat = `${kategori_kode}/${year}/${romanMonth}/${sequence}`;

    const surat = await Surat.create({
      no_surat,
      perihal,
      tanggal,
      isi, 
      kategori_kode,
      profil_id,
      meta_data: meta_data || {},
      user_id: userId
    });

    const verificationUrl = `${process.env.APP_URL}/surat/verify/${surat.id}`;
    const qrcode_base64 = await QRCode.toDataURL(verificationUrl);
    surat.qrcode_base64 = qrcode_base64;
    await surat.save();

    res.status(201).json({ success: true, data: surat });
  } catch (err) {
    console.error('❌ Error di createSurat:', err);
    res.status(400).json({ success: false, message: 'Gagal membuat surat', error: err.message });
  }
}

async function updateSurat(req, res) {
  try {
    const { tanggal, isi, profil_id, meta_data } = req.body;
    const surat = await Surat.findOne({ where: { id: req.params.id, user_id: req.user.uuid } });

    if (!surat) return res.status(404).json({ success: false, message: 'Surat tidak ditemukan' });
    
    await surat.update({
      tanggal,
      isi,
      profil_id,
      meta_data: meta_data || surat.meta_data,
    });

    res.json({ success: true, data: surat });
  } catch (err) {
    console.error('❌ Error di updateSurat:', err);
    res.status(400).json({ success: false, message: 'Gagal memperbarui surat', error: err.message });
  }
}

async function deleteSurat(req, res) {
  try {
    const surat = await Surat.findOne({
        where: { id: req.params.id, user_id: req.user.uuid }
    });
    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan atau Anda tidak punya akses',
      });
    }
    await surat.destroy();
    res.json({ success: true, message: 'Surat berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error di deleteSurat:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus surat',
      error: err.message,
    });
  }
}

async function getSuratById(req, res) {
  try {
    const surat = await Surat.findOne({
      where: { id: req.params.id, user_id: req.user.uuid },
      include: [{ model: Profil, as: 'profil' }, { model: Kategori, as: 'kategori' }]
    });

    if (!surat) return res.status(404).json({ success: false, message: 'Surat tidak ditemukan' });
    
    res.json({ success: true, data: surat });
  } catch (err) {
    console.error('❌ Error di getSuratById:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat detail surat' });
  }
}

async function verifySuratById(req, res) {
  try {
    const surat = await Surat.findOne({
        where: { id: req.params.id },
        include: [{ model: Kategori, as: 'kategori' }]
    });

    if (!surat) {
        return res.status(404).json({ success: false, message: 'Dokumen surat tidak ditemukan' });
    }
    
    res.json({
      success: true,
      data: {
        isi: surat.isi,
        kategori: surat.kategori ? { background_url: surat.kategori.background_url } : null
      }
    });
  } catch (err) {
      console.error('❌ Error di verifySuratById:', err);
      res.status(500).json({ success: false, message: 'Gagal memverifikasi surat' });
  }
}

module.exports = { getSurat, createSurat, updateSurat, deleteSurat, getSuratById, verifySuratById };