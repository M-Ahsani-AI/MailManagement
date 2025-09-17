const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Pembayaran = sequelize.define('Pembayaran', {
  uuid: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  id_kategori: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  id_user: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'users',  // ✅ samakan dengan tabel users
      key: 'uuid',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  id_bank: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'bank',   // ✅ samakan dengan tabel bank
      key: 'nama_bank',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  tahun: DataTypes.INTEGER,
  nomor: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  id_sp: DataTypes.STRING(10),
  isi_pembayaran: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pembayaran',
  timestamps: false,
  freezeTableName: true,
});

module.exports = Pembayaran;
