const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./Customer');
const Order = sequelize.define('Order', {
  status: { type: DataTypes.ENUM('ordered', 'shipped', 'delivered', 'fitted'), defaultValue: 'ordered' },
  total_amount: DataTypes.FLOAT,
  insurance_discount: DataTypes.FLOAT,
  final_amount: DataTypes.FLOAT,
  delivery_date: DataTypes.DATE,
  tracking_number: DataTypes.STRING,
  notes: DataTypes.TEXT
});
Order.belongsTo(Customer);
Customer.hasMany(Order);
module.exports = Order;