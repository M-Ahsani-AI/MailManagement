// backend/controllers/invoiceController.js
const { Op, Sequelize } = require('sequelize');
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const Profil = require('../models/Profil');
const Kategori = require('../models/Kategori');
const User = require('../models/User');
const QRCode = require('qrcode');
const { sequelize } = require('../config/db');

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

async function getInvoice(req, res) {
  try {
    const invoices = await Invoice.findAll({
      where: { user_id: req.user.uuid },
      include: [{ model: Profil, as: 'profil' }, { model: Kategori, as: 'kategori' }],
      order: [['tanggal', 'DESC']],
    });
    res.json({ success: true, data: invoices });
  } catch (err) {
    console.error('❌ Error di getInvoice:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat data invoice' });
  }
}

async function createInvoice(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const { tanggal, isi, profil_id, meta_data } = req.body;
    const userId = req.user.uuid;

    if (!tanggal || !profil_id) {
      return res.status(400).json({ success: false, message: 'Tanggal dan profil tujuan wajib diisi.' });
    }

    const kategori_kode = 'INV';
    const kategori = await Kategori.findOne({ where: { kode: kategori_kode }, transaction });
    if (!kategori) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: "Kategori 'INV' tidak ditemukan." });
    }
    const perihal = kategori.nama_kategori;
    
    const user = await User.findOne({ where: { uuid: userId }, transaction });
    if (!user) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const date = new Date(tanggal);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const count = await Invoice.count({
      where: {
        user_id: userId,
        [Op.and]: [
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('tanggal')), year),
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('tanggal')), month),
        ]
      },
      transaction
    });
    const sequence = (count + 1).toString().padStart(3, '0');
    const romanMonth = toRoman(month);
    const no_invoice = `${kategori_kode}/${year}/${romanMonth}/${sequence}`;

    const invoice = await Invoice.create({
      no_invoice, 
      perihal, 
      tanggal, 
      isi, 
      kategori_kode, 
      profil_id,
      meta_data: meta_data || {}, 
      user_id: userId
    }, { transaction });

    const verificationUrl = `${process.env.APP_URL}/invoice/verify/${invoice.id}`;
    const qrcode_base64 = await QRCode.toDataURL(verificationUrl);
    invoice.qrcode_base64 = qrcode_base64;
    await invoice.save({ transaction });
    
    if (meta_data && meta_data.items && meta_data.items.length > 0) {
        for (const item of meta_data.items) {
            // ✅ KOREKSI PENTING (CREATE): Hitung nilai 'jumlah' sebelum membuat item
            const jumlah = (Number(item.qty) || 0) * (Number(item.harga) || 0);

            await InvoiceItem.create({
                ...item,
                jumlah: jumlah, // Simpan nilai yang sudah dihitung
                invoice_id: invoice.id
            }, { transaction });
        }
    }

    await transaction.commit();
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Error di createInvoice:', err);
    res.status(400).json({ success: false, message: 'Gagal membuat Invoice', error: err.message });
  }
}

async function updateInvoice(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { tanggal, isi, profil_id, meta_data } = req.body;
        const userId = req.user.uuid;

        const invoice = await Invoice.findOne({ where: { id, user_id: userId }, transaction });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });

        await invoice.update({ tanggal, isi, profil_id, meta_data }, { transaction });

        await InvoiceItem.destroy({ where: { invoice_id: id }, transaction });
        
        if (meta_data && meta_data.items && meta_data.items.length > 0) {
            for (const item of meta_data.items) {
                // ✅ KOREKSI PENTING (UPDATE): Hitung nilai 'jumlah' sebelum membuat item
                const jumlah = (Number(item.qty) || 0) * (Number(item.harga) || 0);

                await InvoiceItem.create({
                    ...item,
                    jumlah: jumlah, // Simpan nilai yang sudah dihitung
                    invoice_id: id
                }, { transaction });
            }
        }

        await transaction.commit();
        res.json({ success: true, data: invoice });
    } catch (err) {
        await transaction.rollback();
        console.error('❌ Error di updateInvoice:', err);
        res.status(400).json({ success: false, message: 'Gagal memperbarui Invoice', error: err.message });
    }
}

async function deleteInvoice(req, res) {
  try {
    const invoice = await Invoice.findOne({ where: { id: req.params.id, user_id: req.user.uuid } });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan atau Anda tidak punya akses' });
    
    await invoice.destroy();
    res.json({ success: true, message: 'Invoice berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error di deleteInvoice:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus Invoice' });
  }
}

async function getInvoiceById(req, res) {
    try {
        const invoice = await Invoice.findOne({
            where: { id: req.params.id, user_id: req.user.uuid },
            include: [
                { model: Profil, as: 'profil' },
                { model: Kategori, as: 'kategori' },
                { model: InvoiceItem, as: 'items' }
            ]
        });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
        res.json({ success: true, data: invoice });
    } catch (err) {
        console.error('❌ Error di getInvoiceById:', err);
        res.status(500).json({ success: false, message: 'Gagal memuat detail Invoice' });
    }
}

async function verifyInvoiceById(req, res) {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id },
      include: [
        { model: Kategori, as: 'kategori' },
        { model: User, as: 'user', attributes: ['nama', 'alamat', 'no_telp', 'email', 'logo'] }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Dokumen Invoice tidak ditemukan' });
    }
    res.json({ success: true, data: invoice });
  } catch (err) {
    console.error('❌ Error di verifyInvoiceById:', err);
    res.status(500).json({ success: false, message: 'Gagal memverifikasi Invoice' });
  }
}

module.exports = { getInvoice, createInvoice, updateInvoice, deleteInvoice, getInvoiceById, verifyInvoiceById };