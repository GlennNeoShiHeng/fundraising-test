const { Feedback, IssueTrend, User } = require('../models')

// Story 4: Donee submits feedback
const submitFeedback = async (req, res) => {
  const { message, feedback_type } = req.body
  if (!message?.trim() || message.trim().length < 10) {
    return res.status(400).json({ error: 'Feedback must be at least 10 characters' })
  }
  if (!['issue', 'suggestion'].includes(feedback_type)) {
    return res.status(400).json({ error: 'feedback_type must be "issue" or "suggestion"' })
  }
  const feedback = await Feedback.create({ donee_id: req.user.id, message, feedback_type, status: 'pending' })
  res.status(201).json({ message: 'Feedback submitted successfully', feedback })
}

// Story 5: Platform Manager views feedback trends
const getTrends = async (req, res) => {
  const criteria = {}
  if (req.query.type) criteria.type = req.query.type
  if (req.query.status) criteria.status = req.query.status

  const feedbacks = await Feedback.getFeedbackData(criteria)

  // Count by feedback_type to identify recurring issues
  const counts = {}
  feedbacks.forEach(f => { counts[f.feedback_type] = (counts[f.feedback_type] || 0) + 1 })

  // Upsert trends
  const trends = []
  for (const [issue_type, frequency] of Object.entries(counts)) {
    let trend = await IssueTrend.findOne({ where: { issue_type } })
    if (trend) {
      await trend.update({ frequency })
    } else {
      trend = await IssueTrend.create({ issue_type, frequency })
    }
    trends.push(trend)
  }

  res.json({ feedbacks, trends })
}

module.exports = { submitFeedback, getTrends }
