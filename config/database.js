const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cobafinal', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
