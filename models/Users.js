const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user', // default role is user
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: false,  // Automatically adds 'createdAt' and 'updatedAt'
  }
);

module.exports = User;
