const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan path

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Auto increment untuk ID
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(255),
    unique: true,  // Pastikan username unik
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'user',  // Peran default
  },
}, {
  tableName: 'users', // Nama tabel dalam database
  timestamps: false, // Jika tidak menggunakan createdAt/updatedAt
});

module.exports = User;
