// Story #23 (FR02) - Edit Fundraising Activity Details (Fund Raiser)
// BCE Control: FundraisingController (sequence diagram) / ActivityController (class diagram)
const { FundraisingActivity, Category } = require('../../models')

// validateDetails() - validates that the updated activity fields are valid
const validateDetails = ({ title, description, goal_amount }) => {
  if (!title || title.trim() === '') return { valid: false, error: 'Title is required' }
  if (!description || description.trim() === '') return { valid: false, error: 'Description is required' }
  if (!goal_amount || isNaN(goal_amount) || parseFloat(goal_amount) <= 0) return { valid: false, error: 'Goal amount must be a positive number' }
  return { valid: true }
}

// getActivityById() - retrieves an activity by ID, ensuring it belongs to the fund raiser
const getActivityById = async (req, res) => {
  const { id } = req.params
  const fund_raiser_id = req.user.id
  const activity = await FundraisingActivity.findByPk(id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })
  if (activity.fund_raiser_id !== fund_raiser_id) return res.status(403).json({ error: 'Unauthorised: not your activity' })
  const cat = activity.category_id ? await Category.findByPk(activity.category_id) : null
  res.json({ ...activity.toJSON(), category_name: cat ? cat.name : 'Uncategorised' })
}

// updateActivity() - saves updated fields to the FundraisingActivity entity
const updateActivity = async (activity, data) => {
  activity.title = data.title
  activity.description = data.description
  activity.goal_amount = data.goal_amount
  if (data.category_id !== undefined) activity.category_id = data.category_id || null
  await activity.save()
  return activity
}

// editActivity() - validates and applies edits to the fundraising activity
const editActivity = async (req, res) => {
  const { id } = req.params
  const fund_raiser_id = req.user.id
  const { title, description, goal_amount, category_id } = req.body

  const validation = validateDetails({ title, description, goal_amount })
  if (!validation.valid) return res.status(400).json({ error: validation.error })

  const activity = await FundraisingActivity.findByPk(id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })
  if (activity.fund_raiser_id !== fund_raiser_id) return res.status(403).json({ error: 'Unauthorised: not your activity' })
  if (activity.status === 'cancelled' || activity.status === 'completed') {
    return res.status(400).json({ error: 'Cannot edit a cancelled or completed activity' })
  }

  const updated = await updateActivity(activity, { title, description, goal_amount, category_id })
  res.json({ message: 'Activity updated successfully', activity: updated.toJSON() })
}

module.exports = { editActivity, validateDetails, getActivityById, updateActivity }
