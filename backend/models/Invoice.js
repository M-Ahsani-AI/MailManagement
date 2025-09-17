// backend/models/Invoice.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Invoice extends Model {}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  no_invoice: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // ✅ DIHAPUS: Blok 'perihal' tidak diperlukan lagi di sini.
  profil_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profil',
      key: 'id',
    },
  },
  kategori_kode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    references: {
      model: 'kategori',
      key: 'kode',
    },
  },
  meta_data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  qrcode_base64: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isi: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
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
  modelName: 'Invoice',
  tableName: 'invoice',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true,
});

module.exports = Invoice;