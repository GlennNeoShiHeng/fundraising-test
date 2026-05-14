// Story #12 (DO02) - Search Fundraising Activities (Donee)
// BCE Control: FundraisingController
const { FundraisingActivity, Category } = require('../../models')

// searchFundraisers() - retrieves activities matching keyword, category and date filters
const searchFundraisers = async (req, res) => {
  const { keyword, category_id, date } = req.query
  const activities = await FundraisingActivity.findByFilters({ keyword, category_id, date })

  // Attach category name to each result
  const results = await Promise.all(activities.map(async (a) => {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    const progress = a.getProgress()
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal_amount: a.goal_amount,
      current_amount: a.current_amount,
      progress,
      category: cat ? cat.name : 'Uncategorised',
      status: a.status,
      createdAt: a.createdAt
    }
  }))

  res.json(results)
}

// getCategories() - used by SearchPage to populate category dropdown
const getCategories = async (req, res) => {
  const categories = await Category.findAll()
  res.json(categories)
}

module.exports = { searchFundraisers, getCategories }
