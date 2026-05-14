// Story #7 (DO04) - View Fundraising Activity Details and Progress (Donee)
// BCE Control: ActivityController
const { FundraisingActivity, Category, User } = require('../../models')

// retrieveActivityDetails() - retrieves full activity details including progress
const retrieveActivityDetails = async (req, res) => {
  const { id } = req.params
  const activity = await FundraisingActivity.findByPk(id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })

  const progress = calculateProgress(parseFloat(activity.current_amount), parseFloat(activity.goal_amount))
  const cat = activity.category_id ? await Category.findByPk(activity.category_id) : null
  const raiser = await User.findByPk(activity.fund_raiser_id)

  res.json({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    goal_amount: activity.goal_amount,
    current_amount: activity.current_amount,
    progress,
    category: cat ? cat.name : 'Uncategorised',
    status: activity.status,
    fund_raiser: raiser ? raiser.name : 'Unknown',
    createdAt: activity.createdAt
  })
}

// calculateProgress() - calculates % progress of the campaign
const calculateProgress = (current, goal) => {
  if (!goal || goal <= 0) return 0
  return Math.min(Math.round((current / goal) * 100 * 100) / 100, 100)
}

module.exports = { retrieveActivityDetails, calculateProgress }
