// Story #34 (PA06) - Approve or Reject Fundraising Activities (Platform Manager)
// BCE Control: ApprovalController
const { FundraisingActivity, Category, User } = require('../../models')

// getPendingActivities() - retrieves all activities awaiting Platform Manager review
const getPendingActivities = async (req, res) => {
  const activities = await FundraisingActivity.findAll({
    where: { approval_status: 'pending' },
    order: [['createdAt', 'DESC']]
  })

  const result = await Promise.all(activities.map(async (a) => {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    const raiser = await User.findByPk(a.fund_raiser_id)
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal_amount: a.goal_amount,
      category: cat ? cat.name : 'Uncategorised',
      fund_raiser: raiser ? raiser.name : 'Unknown',
      approval_status: a.approval_status,
      status: a.status,
      createdAt: a.createdAt
    }
  }))

  res.json(result)
}

// getAllActivitiesForReview() - retrieves all activities with their approval status
const getAllActivitiesForReview = async (req, res) => {
  const activities = await FundraisingActivity.findAll({
    order: [['createdAt', 'DESC']]
  })

  const result = await Promise.all(activities.map(async (a) => {
    const cat = a.category_id ? await Category.findByPk(a.category_id) : null
    const raiser = await User.findByPk(a.fund_raiser_id)
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal_amount: a.goal_amount,
      category: cat ? cat.name : 'Uncategorised',
      fund_raiser: raiser ? raiser.name : 'Unknown',
      approval_status: a.approval_status || 'approved',
      rejection_reason: a.rejection_reason,
      status: a.status,
      createdAt: a.createdAt
    }
  }))

  res.json(result)
}

// approveActivity() - marks an activity as approved so it becomes publicly visible
const approveActivity = async (req, res) => {
  const { id } = req.params
  const activity = await FundraisingActivity.findByPk(id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })

  await activity.update({ approval_status: 'approved', rejection_reason: null })
  res.json({ message: 'Activity approved successfully', activity })
}

// rejectActivity() - marks an activity as rejected with a reason
const rejectActivity = async (req, res) => {
  const { id } = req.params
  const { reason } = req.body

  if (!reason || !reason.trim()) return res.status(400).json({ error: 'Rejection reason is required' })

  const activity = await FundraisingActivity.findByPk(id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })

  await activity.update({ approval_status: 'rejected', rejection_reason: reason.trim() })
  res.json({ message: 'Activity rejected', activity })
}

module.exports = { getPendingActivities, getAllActivitiesForReview, approveActivity, rejectActivity }
