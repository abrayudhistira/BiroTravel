const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Users');
const PaketBundling = require('./PaketBundling');

const Keranjang = sequelize.define('Keranjang', {
    keranjang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,  // Primary key menjadi 'keranjang_id'
        autoIncrement: true
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    ID_Paket: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaketBundling,
            key: 'ID_Paket'
        }
    },
    Jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'Keranjang',
    timestamps: false,
});

// Relasi
Keranjang.belongsTo(User, { foreignKey: 'id' });
Keranjang.belongsTo(PaketBundling, { foreignKey: 'ID_Paket', as: 'PaketBundling' });

module.exports = Keranjang;
