const { FundraisingActivity, Category, User } = require('../../models')

// Story 12: Search fundraising activities
const searchFundraisers = async (req, res) => {
  const { keyword, category, date } = req.query

  let category_id = null
  if (category) {
    const matches = await Category.findByCategory(category)
    if (matches.length > 0) category_id = matches[0].id
  }

  const activities = await FundraisingActivity.findByFilters({ keyword, category_id, date })

  const results = await Promise.all(activities.map(async (a) => {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    const fr = await User.findByPk(a.fund_raiser_id)
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal_amount: parseFloat(a.goal_amount),
      current_amount: parseFloat(a.current_amount),
      progress: a.getProgress(),
      status: a.status,
      category: cat ? cat.name : null,
      fund_raiser: fr ? fr.name : null,
      createdAt: a.createdAt
    }
  }))

  res.json({ activities: results })
}

const getCategories = async (req, res) => {
  const categories = await Category.findAll()
  res.json({ categories })
}

module.exports = { searchFundraisers, getCategories }
