// models/Kategori.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Kategori extends Model {}

Kategori.init( {
  kode: {
    type: DataTypes.STRING(4),
    primaryKey: true,
    allowNull: false,
    field: 'kode',
  },
  nama_kategori: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nama_kategori',
  },
  template: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'template',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  sequelize,
  modelName: 'Kategori',
  tableName: 'kategori', // Nama tabel sesuai DB (harus lowercase & plural)
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true,
});

module.exports = Kategori;