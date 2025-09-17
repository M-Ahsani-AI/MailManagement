const { Op, Sequelize } = require('sequelize');
const Bast = require('../models/Bast');
const Kategori = require('../models/Kategori');
const User = require('../models/User');
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

async function getBast(req, res) {
    try {
        const bast = await Bast.findAll({
            where: { user_id: req.user.uuid },
            include: [{ model: Kategori, as: 'kategori' }],
            order: [['tanggal', 'DESC']]
        });
        res.json({ success: true, data: bast });
    } catch (err) {
        console.error('❌ Error di getBast:', err);
        res.status(500).json({ success: false, message: 'Gagal memuat data BAST' });
    }
}

async function createBast(req, res) {
    try {
        const userId = req.user.uuid;
        const { tanggal, isi, meta_data } = req.body;

        if (!tanggal) {
            return res.status(400).json({ success: false, message: 'Tanggal wajib diisi.' });
        }

        const kategori_kode = 'BAST';
        const kategori = await Kategori.findOne({ where: { kode: kategori_kode } });
        if (!kategori) return res.status(404).json({ success: false, message: "Kategori 'BAST' tidak ditemukan." });
        
        const perihal = kategori.nama_kategori;
        
        const user = await User.findOne({ where: { uuid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

        const date = new Date(tanggal);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        const count = await Bast.count({
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
        const no_bast = `${kategori_kode}/${year}/${romanMonth}/${sequence}`;

        const bast = await Bast.create({
            no_bast,
            perihal,
            tanggal,
            isi,
            kategori_kode,
            meta_data: meta_data || {},
            user_id: userId
        });

        const verificationUrl = `${process.env.APP_URL}/bast/verify/${bast.id}`;
        const qrcode_base64 = await QRCode.toDataURL(verificationUrl);

        bast.qrcode_base64 = qrcode_base64;
        await bast.save();

        res.status(201).json({ success: true, data: bast });
    } catch (err) {
        console.error('❌ Error di createBast:', err);
        res.status(400).json({ success: false, message: 'Gagal membuat BAST', error: err.message });
    }
}

async function updateBast(req, res) {
    try {
        const bast = await Bast.findOne({ where: { id: req.params.id, user_id: req.user.uuid } });
        if (!bast) return res.status(404).json({ success: false, message: 'BAST tidak ditemukan' });

        const { tanggal, isi, meta_data } = req.body;
        await bast.update({ tanggal, isi, meta_data });

        res.json({ success: true, data: bast });
    } catch (err) {
        console.error('❌ Error di updateBast:', err);
        res.status(400).json({ success: false, message: 'Gagal memperbarui BAST', error: err.message });
    }
}

async function getBastById(req, res) {
    try {
        const bast = await Bast.findOne({
            where: { id: req.params.id, user_id: req.user.uuid },
            include: [{ model: Kategori, as: 'kategori' }]
        });
        if (!bast) return res.status(404).json({ success: false, message: 'BAST tidak ditemukan' });
        res.json({ success: true, data: bast });
    } catch (err) {
        console.error('❌ Error di getBastById:', err);
        res.status(500).json({ success: false, message: 'Gagal memuat detail BAST' });
    }
}

async function deleteBast(req, res) {
    try {
        const bast = await Bast.findOne({ where: { id: req.params.id, user_id: req.user.uuid } });
        if (!bast) return res.status(404).json({ success: false, message: 'BAST tidak ditemukan atau Anda tidak punya akses' });
        await bast.destroy();
        res.json({ success: true, message: 'BAST berhasil dihapus' });
    } catch (err) {
        console.error('❌ Error di deleteBast:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus BAST' });
    }
}

async function verifyBastById(req, res) {
    try {
        const bast = await Bast.findOne({
            where: { id: req.params.id },
            include: [
                { model: Kategori, as: 'kategori' },
                { model: User, as: 'user', attributes: ['nama', 'alamat', 'no_telp', 'email', 'logo'] }
            ]
        });
        if (!bast) return res.status(404).json({ success: false, message: 'Dokumen BAST tidak ditemukan' });
        res.json({ success: true, data: bast });
    } catch (err) {
        console.error('❌ Error di verifyBastById:', err);
        res.status(500).json({ success: false, message: 'Gagal memverifikasi BAST' });
    }
}

module.exports = { getBast, createBast, updateBast, deleteBast, getBastById, verifyBastById };