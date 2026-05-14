// Story #10 (DN-09) - Recommend Fundraising Campaigns to Donee
// BCE Control: RecommendationController
const { Donation, FundraisingActivity, Category, Favourite } = require('../../models')
const { Op } = require('sequelize')

// getInterestedCategories() - finds categories the donee has previously donated to or favourited
const getInterestedCategories = async (donee_id) => {
  const donations = await Donation.findAll({ where: { donee_id } })
  const favourites = await Favourite.findAll({ where: { donee_id } })

  const activityIds = [
    ...new Set([
      ...donations.map(d => d.activity_id),
      ...favourites.map(f => f.activity_id)
    ])
  ]

  if (activityIds.length === 0) return []

  const activities = await FundraisingActivity.findAll({ where: { id: activityIds } })
  const categoryIds = [...new Set(activities.map(a => a.category_id).filter(Boolean))]
  return categoryIds
}

// filterRecommendedActivities() - finds active activities matching interested categories, excluding already donated ones
const filterRecommendedActivities = async (donee_id, categoryIds, donatedActivityIds) => {
  const where = {
    status: 'active',
    id: { [Op.notIn]: donatedActivityIds.length ? donatedActivityIds : [0] }
  }
  if (categoryIds.length > 0) where.category_id = { [Op.in]: categoryIds }

  return FundraisingActivity.findAll({ where, order: [['createdAt', 'DESC']], limit: 10 })
}

// getRecommendations() - main entry point: returns personalised campaign recommendations
const getRecommendations = async (req, res) => {
  const donee_id = req.user.id

  const categoryIds = await getInterestedCategories(donee_id)

  // Get activities already donated to (exclude from recommendations)
  const donations = await Donation.findAll({ where: { donee_id } })
  const donatedActivityIds = [...new Set(donations.map(d => d.activity_id))]

  // If no history, return popular active activities
  const activities = await filterRecommendedActivities(donee_id, categoryIds, donatedActivityIds)

  // Fallback: if no category matches, return recently added active activities
  const result = activities.length > 0 ? activities : await FundraisingActivity.findAll({
    where: { status: 'active', id: { [Op.notIn]: donatedActivityIds.length ? donatedActivityIds : [0] } },
    order: [['createdAt', 'DESC']],
    limit: 10
  })

  const formatted = await Promise.all(result.map(async (a) => {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal_amount: parseFloat(a.goal_amount),
      current_amount: parseFloat(a.current_amount),
      progress: a.getProgress(),
      category: cat ? cat.name : 'Uncategorised',
      status: a.status,
      createdAt: a.createdAt,
      reason: categoryIds.includes(a.category_id) ? `Based on your interest in ${cat ? cat.name : 'this category'}` : 'Popular on the platform'
    }
  }))

  res.json({ recommendations: formatted, basedOn: categoryIds.length > 0 ? 'your donation and favourite history' : 'popular campaigns' })
}

module.exports = { getRecommendations, getInterestedCategories, filterRecommendedActivities }
