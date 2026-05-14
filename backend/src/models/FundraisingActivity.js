const { DataTypes, Op } = require('sequelize')
const sequelize = require('../database')

const FundraisingActivity = sequelize.define('FundraisingActivity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  goal_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  current_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  category_id: { type: DataTypes.INTEGER },
  fund_raiser_id: { type: DataTypes.INTEGER, allowNull: false },
  // Status: active, paused, completed, cancelled
  status: { type: DataTypes.STRING(20), defaultValue: 'active' },
  // Story #34 (PA06) - Approval: pending, approved, rejected (null = approved for backward compat)
  approval_status: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'fundraising_activities', timestamps: true })

// Instance methods
FundraisingActivity.prototype.getProgress = function () {
  const goal = parseFloat(this.goal_amount)
  const current = parseFloat(this.current_amount)
  if (goal <= 0) return 0
  return Math.round((current / goal) * 100 * 100) / 100
}

// Static methods
FundraisingActivity.findByFilters = async function ({ keyword, category_id, date } = {}) {
  const where = { status: 'active' }
  if (keyword) {
    where[Op.or] = [
      { title: { [Op.like]: `%${keyword}%` } },
      { description: { [Op.like]: `%${keyword}%` } }
    ]
  }
  if (category_id) where.category_id = category_id
  if (date) where.createdAt = { [Op.gte]: new Date(date) }
  return FundraisingActivity.findAll({ where })
}

// Story #20 - getCompletedActivities()
FundraisingActivity.getCompletedActivities = function ({ fund_raiser_id, category_id, startDate, endDate } = {}) {
  const where = { status: 'completed', fund_raiser_id }
  if (category_id) where.category_id = category_id
  if (startDate && endDate) {
    where.updatedAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  } else if (startDate) {
    where.updatedAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.updatedAt = { [Op.lte]: new Date(endDate) }
  }
  return FundraisingActivity.findAll({ where, order: [['updatedAt', 'DESC']] })
}

// Story #21 - getOngoingActivities()
FundraisingActivity.getOngoingActivities = function ({ fund_raiser_id, category_id, startDate, endDate } = {}) {
  const where = { status: 'active', fund_raiser_id }
  if (category_id) where.category_id = category_id
  if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) }
  if (endDate) where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) }
  return FundraisingActivity.findAll({ where, order: [['createdAt', 'DESC']] })
}

module.exports = FundraisingActivity
