const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = sequelize.define('Customer', {
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  phone: DataTypes.STRING,
  address: DataTypes.TEXT,
  hearing_loss_level: DataTypes.ENUM('mild', 'moderate', 'severe'),
  budget_range: DataTypes.FLOAT,
  has_insurance: { type: DataTypes.BOOLEAN, defaultValue: false }
});
module.exports = Customer;