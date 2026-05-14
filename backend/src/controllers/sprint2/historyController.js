// Story #20 (FR04) - View Completed Fundraising Activity History (Fund Raiser)
// BCE Control: HistoryController
const { FundraisingActivity, Category } = require('../../models')

// validateDateRange() - validates that startDate is before endDate
const validateDateRange = (startDate, endDate) => {
  if (startDate && endDate) {
    return new Date(startDate) <= new Date(endDate)
  }
  return true
}

// formatHistoryList() - formats the raw FRA records into a presentable history list
const formatHistoryList = async (activities) => {
  return Promise.all(activities.map(async (a) => {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal_amount: a.goal_amount,
      current_amount: a.current_amount,
      progress: a.getProgress(),
      category: cat ? cat.name : 'Uncategorised',
      category_id: a.category_id,
      status: a.status,
      createdAt: a.createdAt,
      completedAt: a.updatedAt
    }
  }))
}

// searchCompletedFRAs() - retrieves completed activities with optional filters
const searchCompletedFRAs = async (req, res) => {
  const fund_raiser_id = req.user.id
  const { category_id, startDate, endDate } = req.query

  if (!validateDateRange(startDate, endDate)) {
    return res.status(400).json({ error: 'Start date must be before end date' })
  }

  const activities = await FundraisingActivity.getCompletedActivities({ fund_raiser_id, category_id, startDate, endDate })
  const history = await formatHistoryList(activities)
  res.json(history)
}

module.exports = { searchCompletedFRAs, validateDateRange, formatHistoryList }
