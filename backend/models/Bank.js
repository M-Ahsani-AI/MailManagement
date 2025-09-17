// backend/models/Bank.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

class Bank extends Model {}

Bank.init( {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nama_bank: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nama_bank',
  },
  nomor_rekening: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nomor_rekening',
  },
  nama_pemilik: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nama_pemilik',
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
  modelName: 'Bank',
  tableName: 'bank', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true,
});

module.exports = Bank;