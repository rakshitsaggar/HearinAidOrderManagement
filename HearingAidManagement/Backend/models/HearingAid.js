const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const HearingAid = sequelize.define('HearingAid', {
  brand: DataTypes.STRING,
  model: DataTypes.STRING,
  type: DataTypes.ENUM('BTE', 'ITE', 'CIC'),
  price: DataTypes.FLOAT,
  features: DataTypes.JSON,
  suitable_for_loss_levels: DataTypes.JSON,
  in_stock: DataTypes.INTEGER
});
module.exports = HearingAid;