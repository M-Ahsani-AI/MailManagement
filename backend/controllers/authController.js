// controllers/authController.js
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Folder uploads
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, suffix + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (['.jpg', '.jpeg', '.png'].includes(ext) && ['image/jpeg', 'image/jpg', 'image/png'].includes(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file JPG, JPEG, dan PNG yang diizinkan!'));
    }
  },
});

// 🔐 Register
const register = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { nama, email, password, no_telp, kode, role_id, biografi, tahun_berdiri, alamat, jabatan, nama_penandatangan } = req.body;
    const logo = req.file ? req.file.filename : null;
    const ttdFile = req.files?.tanda_tangan ? req.files.tanda_tangan[0] : null;

    // Validasi input
    if (!nama || !email || !password) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi',
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid',
      });
    }

    // Cek duplikat email
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ 1. BUAT COMPANY
    const company = await Company.create({
      nama_cv: nama,
      logo: logoFile ? logoFile.filename : null,
      biografi: biografi || `Perusahaan milik ${nama}`,
      tahun_berdiri: tahun_berdiri || new Date().getFullYear(),
    }, { transaction });

    // ✅ 2. BUAT USER → uuid otomatis
    const user = await User.create({
      // uuid: otomatis dari UUIDV4
      nama,
      email,
      no_telp: no_telp || null,
      kode: kode || null,
      password: hashedPassword,
      logo: logoFile ? logoFile.filename : null,
      alamat: alamat || null,
      role_id: role_id || 2,
      company_id: company.id,
      jabatan,
      nama_penandatangan,
      tanda_tangan: ttdFile ? ttdFile.filename : null,
    }, { transaction });

    await transaction.commit();

    // ✅ Generate token dengan uuid
    const token = jwt.sign(
      { uuid: user.uuid, role_id: user.role_id, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Akun berhasil dibuat',
      token,
      user: {
        uuid: user.uuid,
        nama: user.nama,
        email: user.email,
        no_telp: user.no_telp,
        alamat: user.alamat,
        kode: user.kode,
        logo: user.logo,
        role_id: user.role_id,
        company_id: user.company_id,
        company: {
          id: company.id,
          nama_cv: company.nama_cv,
          logo: company.logo,
          biografi: company.biografi,
          tahun_berdiri: company.tahun_berdiri,
        },
      },
    });
  } catch (error) {
    await transaction.rollback();

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Register error:', error.message);

    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: error.code === 'LIMIT_FILE_SIZE'
          ? 'Ukuran file terlalu besar (max 3MB)'
          : error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 🔐 Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Company,
          as: 'assignedCompany',
          attributes: ['id', 'nama_cv', 'logo', 'biografi', 'tahun_berdiri'],
        },
      ],
      attributes: [
        'uuid',
        'nama',
        'email',
        'password',
        'no_telp',
        'alamat', 
        'kode',
        'logo',
        'npwp',
        'jabatan',
        'nama_penandatangan',
        'tanda_tangan',
        'role_id',
        'company_id',
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // ✅ Gunakan uuid, bukan id
    const token = jwt.sign(
      { uuid: user.uuid, role_id: user.role_id, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: {
        uuid: user.uuid,
        nama: user.nama,
        email: user.email,
        no_telp: user.no_telp,
        alamat: user.alamat,
        kode: user.kode,
        logo: user.logo,
        role_id: user.role_id,
        company_id: user.company_id,
        company: user.assignedCompany ? {
          id: user.assignedCompany.id,
          nama_cv: user.assignedCompany.nama_cv,
          logo: user.assignedCompany.logo,
          biografi: user.assignedCompany.biografi,
          tahun_berdiri: user.assignedCompany.tahun_berdiri,
        } : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

const getMe = async (req, res) => {
    try {
        // ID user (uuid) didapat dari middleware 'protect' yang memverifikasi token
        const user = await User.findOne({
            where: { uuid: req.user.uuid },
            // Ambil semua atribut kecuali password untuk keamanan
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { register, login, upload, getMe };