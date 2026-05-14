// Story #21 (FR05) - Filter Ongoing Fundraising Activities (Fund Raiser)
// BCE Control: FilterController
const { FundraisingActivity, Category } = require('../../models')

// validateFilterCriteria() - validates the provided filter inputs
const validateFilterCriteria = ({ category_id, startDate, endDate }) => {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return { valid: false, error: 'Start date must be before end date' }
  }
  return { valid: true }
}

// getOngoingData() - retrieves active/ongoing activities from the entity
const getOngoingData = async (fund_raiser_id, filters) => {
  return FundraisingActivity.getOngoingActivities({ fund_raiser_id, ...filters })
}

// filterActiveFRAs() - applies filters and returns matching ongoing activities
const filterActiveFRAs = async (req, res) => {
  const fund_raiser_id = req.user.id
  const { category_id, startDate, endDate } = req.query

  const validation = validateFilterCriteria({ category_id, startDate, endDate })
  if (!validation.valid) return res.status(400).json({ error: validation.error })

  const activities = await getOngoingData(fund_raiser_id, { category_id, startDate, endDate })

  const result = await Promise.all(activities.map(async (a) => {
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
      createdAt: a.createdAt
    }
  }))

  res.json(result)
}

module.exports = { filterActiveFRAs, validateFilterCriteria, getOngoingData }
