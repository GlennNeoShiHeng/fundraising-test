const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const IssueTrend = sequelize.define('IssueTrend', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  issue_type: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  frequency: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING(20), defaultValue: 'open' } // open, in_progress, resolved
}, { tableName: 'issue_trends', timestamps: false })

module.exports = IssueTrend
