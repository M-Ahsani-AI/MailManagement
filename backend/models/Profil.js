// models/Profil.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Pastikan db.js meng-ekspor sequelize

class Profil extends Model {}

Profil.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'nama', // Sesuai nama kolom di DB
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      field: 'alamat',
    },
    no_telp: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: null,
      field: 'no_telp',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      validate: {
        isEmail: true,
      },
      field: 'email',
    },
    user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'users',
      key: 'uuid',
    },
    field: 'user_id',
    },
  },
  {
    sequelize,
    modelName: 'Profil',
    tableName: 'profil', // Nama tabel sesuai DB (harus lowercase & plural)
    timestamps: true, // Aktifkan jika kamu ingin Sequelize handle created_at & updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true, // Gunakan snake_case untuk timestamps
    paranoid: false, // Tidak soft delete
  }
);

module.exports = Profil;