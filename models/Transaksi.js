const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Pastikan path ini sesuai
const User = require('./Users');
const PaketBundling = require('./PaketBundling');

const Transaksi = sequelize.define('Transaksi', {
  ID_Transaksi: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  // Hanya ID_Transaksi yang auto-increment
    primaryKey: true,
    allowNull: false,  // Pastikan tidak null
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // Nama tabel Users di database Anda
      key: 'id',       // Kolom id pada tabel users
    },
  },
  ID_Paket: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'paketbundling',  // Nama tabel Paket bundling di database Anda
      key: 'ID_Paket',         // Kolom ID_Paket pada tabel paketbundling
    },
  },
  Jumlah_Pembayaran: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Bukti_Pembayaran: {
    type: DataTypes.BLOB,  // Menyimpan file BLOB
    allowNull: true,       // Bukti pembayaran bisa kosong jika belum di-upload
  },
}, {
  tableName: 'Transaksi',
  timestamps: false,  // Atur ke true jika Anda ingin menambahkan createdAt dan updatedAt
});

// Relasi dengan model lain
Transaksi.belongsTo(User, { foreignKey: 'id' });
Transaksi.belongsTo(PaketBundling, { foreignKey: 'ID_Paket' });

module.exports = Transaksi;
