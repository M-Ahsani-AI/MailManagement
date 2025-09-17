// middleware/authMiddleware.js (SUDAH DIPERBAIKI)
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  let token = null;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Tidak ada token.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; 
    req.user.id = decoded.uuid; 

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau telah kedaluwarsa.',
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role_id === 1) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak: hanya admin yang diizinkan.',
    });
  }
};

module.exports = { protect, admin };