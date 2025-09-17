// backend/controllers/arsipController.js

const { Op } = require('sequelize');
const Arsip = require('../models/Arsip');
const fs = require('fs');
const path = require('path');

// getArsip tidak berubah
async function getArsip(req, res) {
    try {
        const { kategori, search } = req.query;
        const whereClause = { user_id: req.user.uuid };
        if (kategori) {
            whereClause.kategori = kategori;
        }
        if (search) {
            whereClause.judul = { [Op.like]: `%${search}%` };
        }
        const files = await Arsip.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
        });
        res.json({ success: true, data: files });
    } catch (err) {
        console.error('❌ Error di getArsip:', err);
        res.status(500).json({ success: false, message: 'Gagal memuat data arsip' });
    }
}


// ✅ KOREKSI: Logika validasi dan penanganan error diperbaiki secara menyeluruh
async function uploadArsip(req, res) {
    const file = req.file;
    
    // Jika tidak ada file sama sekali, hentikan.
    if (!file) {
        return res.status(400).json({ success: false, message: 'File tidak ditemukan dalam permintaan.' });
    }

    // Ambil data dari body SETELAH multer selesai bekerja
    const { judul, kategori } = req.body;

    // ✅ VALIDASI AWAL: Pastikan semua data yang dibutuhkan ada.
    // Jika tidak, hapus file yang sudah terlanjur di-upload dan kirim error yang jelas.
    if (!judul || !kategori) {
        fs.unlinkSync(file.path); // Hapus file yatim
        return res.status(400).json({ 
            success: false, 
            message: 'Data tidak lengkap. Pastikan Judul dan Kategori terkirim dengan benar.' 
        });
    }

    // Jika validasi lolos, lanjutkan dengan blok try-catch untuk operasi file dan database
    let newPath;
    try {
        const sanitizedJudul = judul.replace(/[\/\\?%*:|"<>]/g, '-').trim();
        const extension = path.extname(file.originalname);
        const displayName = `${sanitizedJudul}${extension}`;
        const uniqueFileName = `${Date.now()}-${sanitizedJudul}${extension}`;
        
        newPath = path.join(file.destination, uniqueFileName);
        
        // Ganti nama file
        fs.renameSync(file.path, newPath);
        
        const relativePath = path.join('uploads', 'arsip', uniqueFileName).replace(/\\/g, '/');

        // Simpan ke database
        const arsip = await Arsip.create({
            judul,
            kategori, // Dijamin ada nilainya karena sudah lolos validasi di atas
            nama_file: uniqueFileName,
            nama_tampilan: displayName,
            path_file: relativePath,
            tipe_file: file.mimetype,
            ukuran_file: file.size,
            user_id: req.user.uuid,
        });

        res.status(201).json({ success: true, data: arsip });

    } catch (err) {
        // Jika terjadi error saat rename atau simpan ke DB, hapus file yang sudah diproses.
        const pathToClean = newPath || file.path; // Hapus file baru jika ada, jika tidak, hapus file lama.
        try {
            fs.unlinkSync(pathToClean);
        } catch (cleanupErr) {
            console.error('Gagal membersihkan file setelah error upload:', cleanupErr.message);
        }

        console.error('❌ Error di uploadArsip:', err);
        // Kirim error spesifik dari Sequelize jika ada
        if (err.name === 'SequelizeValidationError') {
            const messages = err.errors.map(e => e.message).join(', ');
            return res.status(400).json({ success: false, message: messages });
        }
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server saat memproses file.' });
    }
}


// deleteArsip tidak berubah
async function deleteArsip(req, res) {
    try {
        const arsip = await Arsip.findOne({
            where: { id: req.params.id, user_id: req.user.uuid },
        });

        if (!arsip) {
            return res.status(404).json({ success: false, message: 'File tidak ditemukan' });
        }

        const filePathOnServer = path.join(__dirname, '..', '..', arsip.path_file);
        
        fs.unlink(filePathOnServer, async (err) => {
            if (err) {
                console.warn('Gagal hapus file fisik (mungkin sudah tidak ada):', err.message);
            }
            await arsip.destroy();
            res.json({ success: true, message: 'File berhasil dihapus' });
        });
    } catch (err) {
        console.error('❌ Error di deleteArsip:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus file' });
    }
}

module.exports = { getArsip, uploadArsip, deleteArsip };