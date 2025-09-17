// backend/models/SuratKeluar.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class SuratKeluar extends Model {}

SuratKeluar.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    no_surat: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    lampiran: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    perihal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path_file_word: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isi_surat_final: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
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
    modelName: 'SuratKeluar',
    tableName: 'surat_keluar',
    timestamps: true,
    underscored: true,
});

module.exports = SuratKeluar;