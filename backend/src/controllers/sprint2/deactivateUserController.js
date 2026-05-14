// Story #59 (UA03) - Deactivate User Accounts (User Admin)
// BCE Control: DeactivateUserAccountController
const { User } = require('../../models')

// registerSelectedUser() - retrieves selected user record to confirm identity before deactivation
const registerSelectedUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user.toJSON())
}

// deactivateUserSelection() - updates the selected user account status to inactive
const deactivateUserSelection = async (req, res) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (!user.is_active) return res.status(400).json({ error: 'User account is already deactivated' })
  user.is_active = false
  await user.save()
  res.json({ message: 'User account deactivated successfully', user: user.toJSON() })
}

// reactivateUser() - restores an inactive user account to active status
const reactivateUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.is_active) return res.status(400).json({ error: 'User account is already active' })
  user.is_active = true
  await user.save()
  res.json({ message: 'User account reactivated successfully', user: user.toJSON() })
}

module.exports = { registerSelectedUser, deactivateUserSelection, reactivateUser }
