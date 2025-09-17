// models/Bast.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Bast extends Model {}

Bast.init( {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  no_bast: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'no_bast',
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
    allowNull: true,
    field: 'isi',
  },
  nama_pihak_terlibat: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nama_pihak_terlibat',
  },
  nip_pihak_terlibat: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nip_pihak_terlibat',
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
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    references: {
      model: 'users',
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
  modelName: 'Bast',
  tableName: 'bast',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true,
});

module.exports = Bast;