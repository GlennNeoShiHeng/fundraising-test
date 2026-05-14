// Story #38 (PM-06) - Generate Fundraising Reports (Platform Manager)
// BCE Control: ReportController
const { FundraisingActivity, Category, Donation } = require('../../models')
const { Op } = require('sequelize')

// applyFilters() - filters activities by category and time period
const applyFilters = (category_id, timePeriod) => {
  const where = {}
  if (category_id) where.category_id = category_id

  if (timePeriod) {
    const now = new Date()
    let from
    if (timePeriod === '1m') from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    else if (timePeriod === '3m') from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    else if (timePeriod === '6m') from = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    else if (timePeriod === '1y') from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    if (from) where.createdAt = { [Op.gte]: from }
  }

  return where
}

// compileReportData() - aggregates activity data into a report summary
const compileReportData = async (activities) => {
  const categoryMap = {}

  for (const a of activities) {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    const catName = cat ? cat.name : 'Uncategorised'
    const donations = await Donation.findAll({ where: { activity_id: a.id } })
    const totalRaised = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0)

    if (!categoryMap[catName]) {
      categoryMap[catName] = { category: catName, totalCampaigns: 0, activeCampaigns: 0, completedCampaigns: 0, cancelledCampaigns: 0, totalRaised: 0, totalGoal: 0 }
    }

    categoryMap[catName].totalCampaigns++
    categoryMap[catName].totalRaised += totalRaised
    categoryMap[catName].totalGoal += parseFloat(a.goal_amount)
    if (a.status === 'active') categoryMap[catName].activeCampaigns++
    else if (a.status === 'completed') categoryMap[catName].completedCampaigns++
    else if (a.status === 'cancelled') categoryMap[catName].cancelledCampaigns++
  }

  return Object.values(categoryMap).map(c => ({
    ...c,
    totalRaised: parseFloat(c.totalRaised.toFixed(2)),
    totalGoal: parseFloat(c.totalGoal.toFixed(2)),
    achievementRate: c.totalGoal > 0 ? Math.min(Math.round((c.totalRaised / c.totalGoal) * 100), 100) : 0
  }))
}

// generateReport() - main entry point to generate a platform report
const generateReport = async (req, res) => {
  const { category_id, timePeriod } = req.query

  const where = applyFilters(category_id, timePeriod)
  const activities = await FundraisingActivity.findAll({ where, order: [['createdAt', 'DESC']] })

  const breakdown = await compileReportData(activities)

  const totalRaised = breakdown.reduce((s, c) => s + c.totalRaised, 0)
  const totalGoal = breakdown.reduce((s, c) => s + c.totalGoal, 0)
  const totalCampaigns = breakdown.reduce((s, c) => s + c.totalCampaigns, 0)

  res.json({
    generatedAt: new Date().toISOString(),
    filters: { category_id: category_id || null, timePeriod: timePeriod || 'all' },
    summary: {
      totalCampaigns,
      totalRaised: parseFloat(totalRaised.toFixed(2)),
      totalGoal: parseFloat(totalGoal.toFixed(2)),
      overallAchievementRate: totalGoal > 0 ? Math.min(Math.round((totalRaised / totalGoal) * 100), 100) : 0
    },
    breakdown
  })
}

module.exports = { generateReport, applyFilters, compileReportData }
