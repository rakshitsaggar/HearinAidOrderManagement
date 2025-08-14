const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const HearingAid = require('./HearingAid');

const OrderItem = sequelize.define('OrderItem', {
  quantity: DataTypes.INTEGER,
  unit_price: DataTypes.FLOAT,
  ear_side: DataTypes.ENUM('left', 'right', 'both')
});

OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);
OrderItem.belongsTo(HearingAid);
module.exports = OrderItem;