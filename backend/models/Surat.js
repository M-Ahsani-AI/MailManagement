// backend/models/Surat.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Surat extends Model {}

Surat.init( {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  no_surat: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'no_surat',
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'tanggal',
  },
  perihal: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'perihal',
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'isi',
  },
  qrcode_base64: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'qrcode_base64',
  },
  meta_data: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'meta_data',
  },
  kategori_kode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    references: {
      model: 'kategori',
      key: 'kode',
    },
    field: 'kategori_kode',
  },
  profil_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'profil',
      key: 'id',
    },
    field: 'profil_id',
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    references: {
      model: 'user',
      key: 'uuid',
    },
    field: 'user_id',
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
  modelName: 'Surat',
  tableName: 'surat',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true,
});

module.exports = Surat;