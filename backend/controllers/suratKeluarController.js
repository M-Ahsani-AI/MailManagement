// backend/controllers/suratKeluarController.js
const { Op, Sequelize } = require('sequelize');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const SuratKeluar = require('../models/SuratKeluar');
const User = require('../models/User');

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

const generateHeader = (user) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const logoUrl = user?.logo ? `${baseUrl}/uploads/${user.logo}` : '';
    const logo = user?.logo
    ? `<img src="${logoUrl}" alt="Logo" 
        style="max-width:280px; max-height:140px; object-fit:contain; margin-left:auto;">`
    : '';
    return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid black; padding-bottom: 10px; margin-bottom: 20px; gap: 1rem;">
        <div>
            <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">${user?.nama || ''}</h1>
            <p style="margin: 5px 0; font-size: 14px;">${user?.alamat || ''}</p>
            <p style="margin: 5px 0; font-size: 14px;">Telp: ${user?.no_telp || ''} | Email: ${user?.email || ''}</p>
        </div>
        ${logo ? `<div style="text-align:right;">${logo}</div>` : ''}
    </div>
    `;
};

const generateFooter = (user) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const jabatanText = user.jabatan || 'Direktur';
    const namaPenandatangan = user.nama_penandatangan || user.nama; // Fallback ke nama perusahaan jika nama pribadi tidak ada
    const ttdUrl = user.tanda_tangan ? `${baseUrl}/uploads/${user.tanda_tangan}` : '';

    const ttdImageHtml = ttdUrl 
        ? `<img src="${ttdUrl}" alt="Tanda Tangan" style="height: 80px; width: auto; object-fit: contain;">`
        : '<div style="height: 80px; width: 250px;"></div>'; 

    return `
        <div style="width: 100%; margin-top: 50px;">
            <div style="float: right; width: 320px;">
                <p style="margin: 0; text-align: right;">Hormat kami,</p>
                <p style="margin: 0; text-align: right;">${jabatanText} ${user.nama || ''}</p>
                <div style="height: 100px; display: flex; align-items: center; justify-content: flex-end;">
                    ${ttdImageHtml}
                </div>
                <p style="margin: 0; font-weight: bold; text-decoration: underline; text-align: right;">${namaPenandatangan}</p>
            </div>
            <div style="clear: both;"></div>
        </div>
    `;
};

async function createSuratKeluar(req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'File Word tidak ditemukan.' });
    }

    try {
        const { perihal, lampiran } = req.body;
        const userId = req.user.uuid;

        if (!perihal) {
            throw new Error('Perihal wajib diisi.');
        }

        const user = await User.findOne({ where: { uuid: userId } });
        if (!user) {
            throw new Error('User tidak ditemukan.');
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const count = await SuratKeluar.count({
            where: {
                user_id: userId,
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('created_at')), year),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('created_at')), month),
                ]
            }
        });
        const sequence = (count + 1).toString().padStart(3, '0');
        const romanMonth = toRoman(month);
        const no_surat = `${sequence}/SK/CV-${user.kode}/${romanMonth}/${year}`;

        const mammothOptions = {
            styleMap: [
                "p[style-name='Normal'] => p:fresh",
                "p:isEmpty => p:fresh",
                "p[style-name='heading 1'] => h1:fresh",
                "p[style-name='heading 2'] => h2:fresh",
                "p[style-name='heading 3'] => h3:fresh",
                "b => strong",
                "i => em",
                "u => u",
                "strike => s",
            ]
        };

        const { value: wordHtml } = await mammoth.convertToHtml({ path: file.path }, mammothOptions);

        if (!wordHtml && wordHtml !== "") {
            throw new Error('Gagal membaca konten dari file Word. Pastikan file tidak korup atau kosong.');
        }

        const headerHtml = generateHeader(user);
        const footerHtml = generateFooter(user);
        const isi_surat_final = `
            ${headerHtml}
            <p>Nomor: ${no_surat}</p>
            <p>Lampiran: ${lampiran || '-'}</p>
            <p>Perihal: ${perihal}</p>
            <br>
            ${wordHtml}
            ${footerHtml}
        `;

        // ✅ KOREKSI 3: Membuat path relatif yang konsisten
        const relativePath = path.join('uploads', 'surat_keluar', file.filename).replace(/\\/g, '/');

        const suratKeluar = await SuratKeluar.create({
            no_surat,
            lampiran,
            perihal,
            path_file_word: relativePath,
            isi_surat_final,
            user_id: userId,
        });

        res.status(201).json({ success: true, data: suratKeluar });

    } catch (err) {
        if (file) fs.unlinkSync(file.path);
        console.error('❌ Error di createSuratKeluar:', err);
        res.status(400).json({ success: false, message: err.message || 'Gagal membuat surat keluar.' });
    }
}

// ... (Salin sisa fungsi: getSuratKeluar, getSuratKeluarById, deleteSuratKeluar dari kode sebelumnya)
async function getSuratKeluar(req, res) {
    try {
        const letters = await SuratKeluar.findAll({
            where: { user_id: req.user.uuid },
            order: [['created_at', 'DESC']],
        });
        res.json({ success: true, data: letters });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal memuat data.' });
    }
}

async function getSuratKeluarById(req, res) {
    try {
        const letter = await SuratKeluar.findOne({
            where: { id: req.params.id, user_id: req.user.uuid },
        });
        if (!letter) {
            return res.status(404).json({ success: false, message: 'Surat tidak ditemukan.' });
        }
        res.json({ success: true, data: letter });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal memuat data.' });
    }
}

async function deleteSuratKeluar(req, res) {
    try {
        const letter = await SuratKeluar.findOne({
            where: { id: req.params.id, user_id: req.user.uuid },
        });
        if (!letter) {
            return res.status(404).json({ success: false, message: 'Surat tidak ditemukan.' });
        }
        
        // ✅ KOREKSI: Path untuk menghapus file diperbaiki di sini.
        // Kita hanya perlu naik satu level dari '/controllers' ke '/backend'
        const filePathOnServer = path.join(__dirname, '..', letter.path_file_word);

        fs.unlink(filePathOnServer, async (err) => {
            if (err) {
                 // Pesan ini akan muncul jika file memang tidak ada, tapi proses tetap lanjut
                console.warn('Gagal hapus file .docx fisik:', err.message);
            }
            // Tetap hapus data dari database
            await letter.destroy();
            res.json({ success: true, message: 'Surat berhasil dihapus.' });
        });
    } catch (err) {
        console.error('❌ Error di deleteSuratKeluar:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus surat.' });
    }
}

module.exports = { createSuratKeluar, getSuratKeluar, getSuratKeluarById, deleteSuratKeluar };