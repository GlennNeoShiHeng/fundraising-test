const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  donee_id: { type: DataTypes.INTEGER, allowNull: false },
  feedback_type: { type: DataTypes.STRING(50), allowNull: false }, // 'issue' or 'suggestion'
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING(20), defaultValue: 'pending' } // pending, reviewed, resolved
}, { tableName: 'feedbacks', timestamps: true })

Feedback.getFeedbackData = function (criteria = {}) {
  const where = {}
  if (criteria.type) where.feedback_type = criteria.type
  if (criteria.status) where.status = criteria.status
  return Feedback.findAll({ where, order: [['createdAt', 'DESC']] })
}

module.exports = Feedback
