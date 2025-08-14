const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./Customer');
const Order = require('./Order');

const Appointment = sequelize.define('Appointment', {
  appointment_type: DataTypes.STRING,
  scheduled_date: DataTypes.DATE,
  status: { type: DataTypes.STRING, defaultValue: 'scheduled' },
  notes: DataTypes.TEXT
});
Appointment.belongsTo(Customer);
Appointment.belongsTo(Order);
module.exports = Appointment;