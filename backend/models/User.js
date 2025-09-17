// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  uuid: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  nama: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  no_telp: {
    type: DataTypes.STRING(13),
    allowNull: true,
  },
  npwp: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  kode: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  jabatan: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  nama_penandatangan: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  tanda_tangan: { // Path ke file gambar tanda tangan
      type: DataTypes.STRING,
      allowNull: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    references: {
      model: 'roles',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
});

module.exports = User;