const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(256), allowNull: false },
  // Roles: donee, fund_raiser, platform_manager, user_admin
  role: { type: DataTypes.STRING(50), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'users', timestamps: true })

// Instance methods
User.prototype.setPassword = function (password) {
  this.password_hash = bcrypt.hashSync(password, 10)
}

User.prototype.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password_hash)
}

User.prototype.isStaff = function () {
  return ['platform_manager', 'user_admin'].includes(this.role)
}

User.prototype.toJSON = function () {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    role: this.role,
    is_active: this.is_active,
    createdAt: this.createdAt
  }
}

// Static methods
User.findByEmail = function (email) {
  return User.findOne({ where: { email } })
}

module.exports = User
