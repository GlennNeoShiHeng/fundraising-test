const { DataTypes, Op } = require('sequelize')
const sequelize = require('../database')

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255) }
}, { tableName: 'categories', timestamps: false })

Category.findByCategory = function (name) {
  return Category.findAll({ where: { name: { [Op.like]: `%${name}%` } } })
}

module.exports = Category
