// Story #22 (FR-22) - Identify and Segment Interested Users (Fund Raiser)
// BCE Control: SegmentController
const { FundraisingActivity, Donation, Favourite, User, Category } = require('../../models')

// getActivitiesList() - retrieves all activities belonging to the Fund Raiser for selection
const getActivitiesList = async (req, res) => {
  const fund_raiser_id = req.user.id
  const activities = await FundraisingActivity.findAll({
    where: { fund_raiser_id },
    order: [['createdAt', 'DESC']]
  })

  const result = await Promise.all(activities.map(async (a) => {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    return {
      id: a.id,
      title: a.title,
      status: a.status,
      category: cat ? cat.name : 'Uncategorised',
      goal_amount: parseFloat(a.goal_amount),
      current_amount: parseFloat(a.current_amount)
    }
  }))

  res.json(result)
}

// segmentDonors() - retrieves unique users who have donated to the activity
const segmentDonors = async (activity_id) => {
  const donations = await Donation.findAll({ where: { activity_id } })
  const uniqueDoneeIds = [...new Set(donations.map(d => d.donee_id))]

  return Promise.all(uniqueDoneeIds.map(async (donee_id) => {
    const user = await User.findByPk(donee_id)
    const userDonations = donations.filter(d => d.donee_id === donee_id)
    const totalGiven = userDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0)
    return {
      id: donee_id,
      name: user ? user.name : 'Unknown',
      email: user ? user.email : '',
      donationCount: userDonations.length,
      totalGiven: parseFloat(totalGiven.toFixed(2))
    }
  }))
}

// segmentFavouriters() - retrieves unique users who have favourited the activity
const segmentFavouriters = async (activity_id) => {
  const favourites = await Favourite.findAll({ where: { activity_id } })

  return Promise.all(favourites.map(async (f) => {
    const user = await User.findByPk(f.donee_id)
    return {
      id: f.donee_id,
      name: user ? user.name : 'Unknown',
      email: user ? user.email : ''
    }
  }))
}

// analyseUserInterest() - main function: returns segmented user data for a given activity
const analyseUserInterest = async (req, res) => {
  const fund_raiser_id = req.user.id
  const { activityId } = req.params

  // Verify the activity belongs to this fund raiser
  const activity = await FundraisingActivity.findOne({ where: { id: activityId, fund_raiser_id } })
  if (!activity) return res.status(404).json({ error: 'Activity not found or access denied' })

  const cat = activity.category_id ? await Category.findByPk(activity.category_id) : null

  const [donors, favouriters] = await Promise.all([
    segmentDonors(activityId),
    segmentFavouriters(activityId)
  ])

  // Find users who appear in both segments
  const donorIds = new Set(donors.map(d => d.id))
  const highlyInterested = favouriters.filter(f => donorIds.has(f.id))

  res.json({
    activity: {
      id: activity.id,
      title: activity.title,
      category: cat ? cat.name : 'Uncategorised',
      status: activity.status,
      goal_amount: parseFloat(activity.goal_amount),
      current_amount: parseFloat(activity.current_amount)
    },
    segments: {
      donors: { count: donors.length, users: donors },
      favouriters: { count: favouriters.length, users: favouriters },
      highlyInterested: { count: highlyInterested.length, users: highlyInterested }
    }
  })
}

module.exports = { getActivitiesList, analyseUserInterest, segmentDonors, segmentFavouriters }
