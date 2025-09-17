const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,   // ✅ match dengan AUTO_INCREMENT
    autoIncrement: true,
    primaryKey: true,
  },
  role_name: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
}, {
  tableName: 'roles',
  timestamps: false,
  freezeTableName: true,
});

module.exports = Role;
