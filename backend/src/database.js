const { Sequelize } = require('sequelize')
const { DB_PATH } = require('./config')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_PATH,
  logging: false
})

module.exports = sequelize
