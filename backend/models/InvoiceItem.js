// backend/models/InvoiceItem.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class InvoiceItem extends Model {}

InvoiceItem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'invoice',
      key: 'id',
    },
    field: 'invoice_id',
  },
  produk: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'produk',
  },
  deskripsi: {
    type: DataTypes.TEXT,
    field: 'deskripsi',
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'qty',
  },
  harga: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'harga',
  },
  jumlah: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'jumlah',
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
  modelName: 'InvoiceItem',
  tableName: 'invoice_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true,
});

module.exports = InvoiceItem;