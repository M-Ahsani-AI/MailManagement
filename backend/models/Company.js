// models/Company.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nama_cv: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  biografi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tahun_berdiri: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'companies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
});

module.exports = Company;