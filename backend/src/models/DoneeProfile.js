const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const DoneeProfile = sequelize.define('DoneeProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  phone_number: { type: DataTypes.STRING(20) },
  address: { type: DataTypes.STRING(255) },
  date_of_birth: { type: DataTypes.DATEONLY }
}, { tableName: 'donee_profiles', timestamps: true })

module.exports = DoneeProfile
