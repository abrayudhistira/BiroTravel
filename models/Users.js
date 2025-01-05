const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan path

const User = sequelize.define('User ', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'user', // Default role adalah 'user'
    },
    nama: {
        type: DataTypes.STRING(255),
        allowNull: true, // Bisa null untuk admin
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true, // Bisa null untuk admin
    },
    alamat: {
        type: DataTypes.STRING(255),
        allowNull: true, // Bisa null untuk admin
    },
    no_telp: {
        type: DataTypes.STRING(20),
        allowNull: true, // Bisa null untuk admin
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;