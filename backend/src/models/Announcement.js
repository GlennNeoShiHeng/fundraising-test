const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Announcement = sequelize.define('Announcement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'announcements', timestamps: true })

module.exports = Announcement
