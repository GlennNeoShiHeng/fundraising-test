const { DataTypes } = require('sequelize')
const sequelize = require('../database')

// Story #8 - FavouriteList entity
const Favourite = sequelize.define('Favourite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  donee_id: { type: DataTypes.INTEGER, allowNull: false },
  activity_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'favourites', timestamps: true })

// addActivity()
Favourite.addActivity = function (donee_id, activity_id) {
  return Favourite.create({ donee_id, activity_id })
}

// removeActivity()
Favourite.removeActivity = function (donee_id, activity_id) {
  return Favourite.destroy({ where: { donee_id, activity_id } })
}

// getFavourites()
Favourite.getFavourites = function (donee_id) {
  return Favourite.findAll({ where: { donee_id } })
}

module.exports = Favourite
