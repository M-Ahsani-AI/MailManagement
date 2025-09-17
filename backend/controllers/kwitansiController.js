const { Op, Sequelize } = require('sequelize');
const Kwitansi = require('../models/Kwitansi');
const Profil = require('../models/Profil');
const Kategori = require('../models/Kategori');
const User = require('../models/User');
const QRCode = require('qrcode');
const { numberToWords } = require('../utils/numberToWords');

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

async function getKwitansi(req, res) {
  try {
    const kwitansi = await Kwitansi.findAll({
      where: { user_id: req.user.uuid },
      include: [
        { model: Profil, as: 'profil' },
        { model: Kategori, as: 'kategori' }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json({ success: true, data: kwitansi });
  } catch (err) {
    console.error('❌ Error di getKwitansi:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat data kwitansi' });
  }
}

async function createKwitansi(req, res) {
  try {
    const { tanggal, isi, profil_id, meta_data } = req.body;
    const userId = req.user.uuid;

    if (!tanggal || !profil_id) {
      return res.status(400).json({ success: false, message: 'Tanggal dan profil tujuan wajib diisi.' });
    }

    const dynamicData = meta_data?.dynamicFields || {};
    const jumlah = Number(dynamicData.jumlah) || 0;
    const untuk = dynamicData.untuk_pembayaran || 'Tidak ada keterangan';
    const terbilang = numberToWords(jumlah);

    // Tetap simpan terbilang di meta_data untuk konsistensi preview
    if(meta_data && meta_data.dynamicFields){
      meta_data.dynamicFields.terbilang = terbilang;
    }

    const kategori_kode = 'KWT';
    const user = await User.findOne({ where: { uuid: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

    const date = new Date(tanggal);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const count = await Kwitansi.count({
      where: {
        user_id: userId,
        [Op.and]: [
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('tanggal')), year),
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('tanggal')), month),
        ]
      }
    });
    const sequence = (count + 1).toString().padStart(3, '0');
    const romanMonth = toRoman(month);
    const no_kwitansi = `${kategori_kode}/${year}/${romanMonth}/${sequence}`;

    const kwitansi = await Kwitansi.create({
      no_kwitansi,
      tanggal,
      profil_id,
      user_id: userId,
      kategori_kode,
      isi,
      meta_data,
      // ✅ DISESUAIKAN: Isi kolom-kolom yang NOT NULL
      jumlah,
      terbilang,
      untuk,
    });

    const verificationUrl = `${process.env.APP_URL}/kwitansi/verify/${kwitansi.id}`;
    kwitansi.qrcode_base64 = await QRCode.toDataURL(verificationUrl);
    await kwitansi.save();

    res.status(201).json({ success: true, data: kwitansi });
  } catch (err) {
    console.error('❌ Error di createKwitansi:', err);
    res.status(400).json({ success: false, message: 'Gagal membuat kwitansi', error: err.message });
  }
}

async function updateKwitansi(req, res) {
  try {
    const { tanggal, isi, profil_id, meta_data } = req.body;
    const kwitansi = await Kwitansi.findOne({ where: { id: req.params.id, user_id: req.user.uuid } });

    if (!kwitansi) return res.status(404).json({ success: false, message: 'Kwitansi tidak ditemukan' });

    // ✅ DISESUAIKAN: Ekstrak data dari meta_data untuk update kolom individual
    const dynamicData = meta_data?.dynamicFields || {};
    const jumlah = Number(dynamicData.jumlah) || kwitansi.jumlah;
    const untuk = dynamicData.untuk_pembayaran || kwitansi.untuk;
    const terbilang = numberToWords(jumlah);
    
    if(meta_data && meta_data.dynamicFields){
      meta_data.dynamicFields.terbilang = terbilang;
    }

    await kwitansi.update({
        tanggal,
        isi,
        profil_id,
        meta_data: meta_data || kwitansi.meta_data,
        // ✅ DISESUAIKAN: Update juga kolom-kolom yang NOT NULL
        jumlah,
        terbilang,
        untuk
    });

    res.json({ success: true, data: kwitansi });
  } catch (err) {
    console.error('❌ Error di updateKwitansi:', err);
    res.status(400).json({ success: false, message: 'Gagal memperbarui kwitansi', error: err.message });
  }
}

// ... fungsi delete, getById, verifyById tidak berubah ...
async function deleteKwitansi(req, res) {
  try {
    const kwitansi = await Kwitansi.findOne({ where: { id: req.params.id, user_id: req.user.uuid } });
    if (!kwitansi) return res.status(404).json({ success: false, message: 'Kwitansi tidak ditemukan atau Anda tidak punya akses' });
    await kwitansi.destroy();
    res.json({ success: true, message: 'Kwitansi berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error di deleteKwitansi:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus kwitansi' });
  }
}

async function getKwitansiById(req, res) {
  try {
    const kwitansi = await Kwitansi.findOne({
      where: { id: req.params.id, user_id: req.user.uuid },
      include: [{ model: Profil, as: 'profil' }, { model: Kategori, as: 'kategori' }]
    });
    if (!kwitansi) return res.status(404).json({ success: false, message: 'Kwitansi tidak ditemukan' });
    res.json({ success: true, data: kwitansi });
  } catch (err) {
    console.error('❌ Error di getKwitansiById:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat detail kwitansi' });
  }
}

async function verifyKwitansiById(req, res) {
  try {
    const kwitansi = await Kwitansi.findOne({
      where: { id: req.params.id },
      include: [
        { model: Kategori, as: 'kategori' },
        { model: User, as: 'user', attributes: ['nama', 'alamat', 'no_telp', 'email', 'logo'] },
        { model: Profil, as: 'profil' }
      ]
    });
    if (!kwitansi) return res.status(404).json({ success: false, message: 'Dokumen kwitansi tidak ditemukan' });
    res.json({ success: true, data: kwitansi });
  } catch (err) {
    console.error('❌ Error di verifyKwitansiById:', err);
    res.status(500).json({ success: false, message: 'Gagal memverifikasi kwitansi' });
  }
}

module.exports = { getKwitansi, createKwitansi, updateKwitansi, deleteKwitansi, getKwitansiById, verifyKwitansiById };