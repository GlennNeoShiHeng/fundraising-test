const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Donation = sequelize.define('Donation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  donee_id: { type: DataTypes.INTEGER, allowNull: false },
  activity_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'donations', timestamps: true })

Donation.findByDoneeId = function (donee_id) {
  return Donation.findAll({ where: { donee_id }, order: [['createdAt', 'DESC']] })
}

module.exports = Donation
