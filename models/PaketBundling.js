const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaketBundling = sequelize.define('paketbundling', {
    ID_Paket: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Nama_paket: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Gambar: {
        type: DataTypes.BLOB('long'), // Menggunakan BLOB untuk gambar
        allowNull: true
    },
    Harga: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'paketbundling',
    timestamps: false
});



module.exports = PaketBundling;