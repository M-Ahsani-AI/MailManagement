// backend/models/Arsip.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Arsip extends Model {}

Arsip.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nama_file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nama_tampilan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path_file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipe_file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ukuran_file: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kategori: {
        type: DataTypes.ENUM('Faktur', 'Billing', 'Bukti Pembayaran'),
        allowNull: false,
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
    modelName: 'Arsip',
    tableName: 'arsip_file',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
});

module.exports = Arsip;