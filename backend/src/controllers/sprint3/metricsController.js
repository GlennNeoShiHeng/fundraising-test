// Story #19 (FR-02) - View Fund Raising Activities with Performance Metrics (Fund Raiser)
// BCE Control: MetricsController
const { FundraisingActivity, Donation, Favourite, Category } = require('../../models')

// calculateEngagementRate() - calculates engagement as % of donors vs shortlisters
const calculateEngagementRate = (totalDonations, shortListCount) => {
  if (shortListCount === 0) return 0
  return Math.min(Math.round((totalDonations / shortListCount) * 100 * 100) / 100, 100)
}

// formatMetricDisplay() - formats raw metrics into a display-ready object
const formatMetricDisplay = (activity, donations, shortListCount, cat) => {
  const totalDonationAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0)
  const donorCount = new Set(donations.map(d => d.donee_id)).size
  const engagementRate = calculateEngagementRate(donorCount, shortListCount)
  const progress = activity.getProgress()

  return {
    id: activity.id,
    title: activity.title,
    status: activity.status,
    category: cat ? cat.name : 'Uncategorised',
    goal_amount: activity.goal_amount,
    current_amount: activity.current_amount,
    progress,
    viewCount: 0,
    searchAppearances: 0,
    shortListCount,
    totalDonations: parseFloat(totalDonationAmount.toFixed(2)),
    donorCount,
    engagementRate,
    createdAt: activity.createdAt
  }
}

// getPerformanceData() - retrieves and computes metrics for a specific FRA
const getPerformanceData = async (req, res) => {
  const fund_raiser_id = req.user.id
  const { fraID } = req.params

  const activity = await FundraisingActivity.findOne({ where: { id: fraID, fund_raiser_id } })
  if (!activity) return res.status(404).json({ error: 'Activity not found' })

  const donations = await Donation.findAll({ where: { activity_id: fraID } })
  const shortListCount = await Favourite.count({ where: { activity_id: fraID } })
  const cat = activity.category_id ? await Category.findByPk(activity.category_id) : null

  const metrics = formatMetricDisplay(activity, donations, shortListCount, cat)
  res.json(metrics)
}

// getAllPerformanceData() - retrieves metrics for all FRAs belonging to the fund raiser
const getAllPerformanceData = async (req, res) => {
  const fund_raiser_id = req.user.id

  const activities = await FundraisingActivity.findAll({
    where: { fund_raiser_id },
    order: [['createdAt', 'DESC']]
  })

  const result = await Promise.all(activities.map(async (activity) => {
    const donations = await Donation.findAll({ where: { activity_id: activity.id } })
    const shortListCount = await Favourite.count({ where: { activity_id: activity.id } })
    const cat = activity.category_id ? await Category.findByPk(activity.category_id) : null
    return formatMetricDisplay(activity, donations, shortListCount, cat)
  }))

  res.json(result)
}

module.exports = { getPerformanceData, getAllPerformanceData, calculateEngagementRate, formatMetricDisplay }
