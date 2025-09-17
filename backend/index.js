const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const os = require('os');
const path = require('path'); 

dotenv.config();

const app = express();

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        iface.netmask.startsWith('255.255')
      ) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const localIP = getLocalIP();
console.log(`🌐 Server IP lokal: http://${localIP}:5000`);

let allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

const defaultDevOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.0:3000',
  'http://127.0.0.1:3000'
];

defaultDevOrigins.forEach(origin => {
  if (!allowedOrigins.includes(origin)) allowedOrigins.push(origin);
});

console.log('✅ Allowed CORS origins (explicit):', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

  const patterns = [
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/,
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/,
    /^http:\/\/172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}:\d+$/,
    ];

    const isAllowed = patterns.some(pattern => pattern.test(origin));

    if (isAllowed) {
      console.log(`✅ Allowed private network: ${origin}`);
      return callback(null, true);
    }

    console.warn(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Set-Cookie',
  ],
  exposedHeaders: ['Set-Cookie'],
}));

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Memuat semua model dan asosiasi
require('./models/User');
require('./models/Role');
require('./models/Profil');
require('./models/Bank');
require('./models/Kategori');
require('./models/Surat');
require('./models/Bast');
require('./models/Invoice');
require('./models/InvoiceItem');
require('./models/Kwitansi');
require('./models/Arsip');
require('./models/SuratKeluar');
require('./models/Pembayaran');
require('./models/Company');

require('./models/association');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/profil', require('./routes/profilRoutes'));
app.use('/api/bank', require('./routes/bankRoutes'));
app.use('/api/kategori', require('./routes/kategoriRoutes'));
app.use('/api/surat', require('./routes/suratRoutes'));
app.use('/api/bast', require('./routes/bastRoutes'));
app.use('/api/invoice', require('./routes/invoiceRoutes'));
app.use('/api/kwitansi', require('./routes/kwitansiRoutes'));
app.use('/api/arsip', require('./routes/arsipRoutes'));
app.use('/api/surat-keluar', require('./routes/suratKeluarRoutes.js'));
app.use('/api/pembayaran', require('./routes/pembayaranRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));

if (process.env.NODE_ENV === 'production') {
  // Tentukan path ke folder build frontend
  // Sesuaikan path '..' jika struktur folder Anda berbeda
  const buildPath = path.join(__dirname, '..', 'frontend', 'build');
  
  // Middleware untuk menyajikan file statis dari folder build
  app.use(express.static(buildPath));

  // "Catch-all": Untuk semua permintaan GET yang bukan API,
  // kirim file index.html React agar client-side routing bisa bekerja.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
}

// Middleware untuk menangani error CORS secara spesifik
app.use((err, req, res, next) => {
  if (err.message.includes('Not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak oleh CORS policy',
      origin: req.headers.origin,
    });
  }
  next(err);
});

// Middleware untuk menangani semua error server lainnya
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// Middleware untuk menangani rute 404 Not Found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute ${req.method} ${req.path} tidak ditemukan`,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected...');

    await sequelize.sync({ alter: false, force: false });
    console.log('✅ Semua model telah disinkronisasi');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`🌐 Akses dari jaringan lokal: http://${localIP}:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

