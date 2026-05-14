// Story #3 (DO06) - Search and View Donation History (Donee)
// BCE Control: DonationHistoryController
const { Donation, FundraisingActivity, Category } = require('../../models')
const { Op } = require('sequelize')

// validateFilters() - validates that startDate is before endDate
const validateFilters = (category, startDate, endDate) => {
  if (startDate && endDate) {
    return new Date(startDate) <= new Date(endDate)
  }
  return true
}

// getDonationDetails() - retrieves details of a single donation record
const getDonationDetails = async (donationId) => {
  return Donation.findByPk(donationId)
}

// searchHistory() - retrieves donation records filtered by category and date range
const searchHistory = async (req, res) => {
  const donee_id = req.user.id
  const { category_id, startDate, endDate } = req.query

  if (!validateFilters(category_id, startDate, endDate)) {
    return res.status(400).json({ error: 'Start date must be before end date' })
  }

  // Build date filter on donation createdAt
  const where = { donee_id }
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59')] }
  } else if (startDate) {
    where.createdAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.createdAt = { [Op.lte]: new Date(endDate + 'T23:59:59') }
  }

  const donations = await Donation.findAll({ where, order: [['createdAt', 'DESC']] })

  // Enrich each donation with activity and category info, apply category filter
  const result = []
  for (const d of donations) {
    const activity = await FundraisingActivity.findByPk(d.activity_id)
    if (!activity) continue
    if (category_id && activity.category_id != category_id) continue
    const cat = activity.category_id ? await Category.findByPk(activity.category_id) : null
    result.push({
      id: d.id,
      amount: d.amount,
      donatedAt: d.createdAt,
      activity_id: activity.id,
      activityTitle: activity.title,
      activityStatus: activity.status,
      category: cat ? cat.name : 'Uncategorised',
      category_id: activity.category_id
    })
  }

  res.json(result)
}

module.exports = { searchHistory, validateFilters, getDonationDetails }
