// backend/models/Kwitansi.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Kwitansi extends Model {}

Kwitansi.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  no_kwitansi: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // ✅ DISESUAIKAN: Kolom-kolom lama ditambahkan kembali sesuai gambar
  jumlah: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  terbilang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  untuk: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Kolom baru tetap ada
  isi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  qrcode_base64: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  meta_data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  kategori_kode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    defaultValue: 'KWT',
    references: {
      model: 'kategori',
      key: 'kode',
    },
  },
  profil_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profil',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'users',
      key: 'uuid',
    },
  },
}, {
  sequelize,
  modelName: 'Kwitansi',
  tableName: 'kwitansi',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
});

module.exports = Kwitansi;