const { Donation, FundraisingActivity, Category } = require('../../models')

// Story 27: View progress of contributed fundraising activities
const getDonationHistory = async (req, res) => {
  const donations = await Donation.findByDoneeId(req.user.id)

  const results = await Promise.all(donations.map(async (d) => {
    const activity = await FundraisingActivity.findByPk(d.activity_id)
    const cat = activity?.category_id ? await Category.findByPk(activity.category_id) : null
    return {
      id: d.id,
      amount: parseFloat(d.amount),
      donated_at: d.createdAt,
      activity: activity ? {
        id: activity.id,
        title: activity.title,
        goal_amount: parseFloat(activity.goal_amount),
        current_amount: parseFloat(activity.current_amount),
        progress: activity.getProgress(),
        status: activity.status,
        category: cat ? cat.name : null
      } : null
    }
  }))

  res.json({ donations: results })
}

module.exports = { getDonationHistory }
