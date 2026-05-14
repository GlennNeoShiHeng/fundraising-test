// Story #24 (FR-07) - Delete or Cancel Fundraising Activity (Fund Raiser)
// BCE Control: ActivityController
const { FundraisingActivity } = require('../../models')

// validateActivityStatus() - checks that the activity belongs to the fund raiser
const validateActivityStatus = async (activityId, fund_raiser_id) => {
  const activity = await FundraisingActivity.findOne({ where: { id: activityId, fund_raiser_id } })
  return activity || null
}

// deleteActivity() - permanently removes a fundraising activity
const deleteActivity = async (req, res) => {
  const fund_raiser_id = req.user.id
  const { activityId } = req.params

  const activity = await validateActivityStatus(activityId, fund_raiser_id)
  if (!activity) return res.status(404).json({ error: 'Activity not found or access denied' })

  await activity.destroy()
  res.json({ message: 'Activity deleted successfully' })
}

// cancelActivity() - sets the activity status to cancelled
const cancelActivity = async (req, res) => {
  const fund_raiser_id = req.user.id
  const { activityId } = req.params

  const activity = await validateActivityStatus(activityId, fund_raiser_id)
  if (!activity) return res.status(404).json({ error: 'Activity not found or access denied' })

  if (activity.status === 'cancelled') {
    return res.status(400).json({ error: 'Activity is already cancelled' })
  }

  await activity.update({ status: 'cancelled' })
  res.json({ message: 'Activity cancelled successfully', activity })
}

module.exports = { deleteActivity, cancelActivity, validateActivityStatus }
