const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const RecurringDonation = sequelize.define('RecurringDonation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  donee_id: { type: DataTypes.INTEGER, allowNull: false },
  activity_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  frequency: { type: DataTypes.STRING(20), defaultValue: 'monthly' },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  next_payment_date: { type: DataTypes.DATEONLY, allowNull: false },
  payment_method: { type: DataTypes.STRING(50), defaultValue: 'Credit Card' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'recurring_donations', timestamps: true })

module.exports = RecurringDonation
