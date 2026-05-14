// Story #27 (DO03) - View Progress of Contributed Fundraising Activities (Donee)
// BCE Control: DonationController
const { Donation, FundraisingActivity, Category } = require('../../models')

// getContributedActivities() - retrieves all activities donated to by the logged-in donee
const getContributedActivities = async (req, res) => {
  const donee_id = req.user.id
  const donations = await Donation.findByDoneeId(donee_id)

  // Group donations by activity to avoid duplicates
  const activityMap = {}
  for (const donation of donations) {
    if (!activityMap[donation.activity_id]) {
      activityMap[donation.activity_id] = parseFloat(donation.amount)
    } else {
      activityMap[donation.activity_id] += parseFloat(donation.amount)
    }
  }

  const activityIds = Object.keys(activityMap)
  if (activityIds.length === 0) return res.json([])

  const activities = await FundraisingActivity.findAll({ where: { id: activityIds } })

  // calculateProgress() - calculates progress for each contributed activity
  const result = await Promise.all(activities.map(async (a) => {
    const progress = calculateProgress(parseFloat(a.current_amount), parseFloat(a.goal_amount))
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal_amount: a.goal_amount,
      current_amount: a.current_amount,
      my_contribution: activityMap[a.id],
      progress,
      category: cat ? cat.name : 'Uncategorised',
      status: a.status
    }
  }))

  res.json(result)
}

// calculateProgress() - calculates percentage raised against goal
const calculateProgress = (current, goal) => {
  if (!goal || goal <= 0) return 0
  return Math.min(Math.round((current / goal) * 100 * 100) / 100, 100)
}

module.exports = { getContributedActivities, calculateProgress }
