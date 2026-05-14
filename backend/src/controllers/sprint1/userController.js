const { User } = require('../../models')

const VALID_ROLES = ['donee', 'fund_raiser', 'platform_manager', 'user_admin']

// Story #48 - Validate inputs before creating user
const validateInputs = (data) => {
  const errors = []
  if (!data.name?.trim()) errors.push('Name is required')
  if (!data.email?.trim()) errors.push('Email is required')
  if (!data.password || data.password.length < 6) errors.push('Password must be at least 6 characters')
  if (!data.role || !VALID_ROLES.includes(data.role)) errors.push(`Role must be one of: ${VALID_ROLES.join(', ')}`)
  return errors
}

// Story #48 - CreateUserAccountController: createUser()
const createUser = async (req, res) => {
  const errors = validateInputs(req.body)
  if (errors.length) return res.status(400).json({ errors })

  const existing = await User.findByEmail(req.body.email)
  if (existing) return res.status(400).json({ errors: ['Email is already in use'] })

  const user = User.build({ name: req.body.name, email: req.body.email, role: req.body.role })
  user.setPassword(req.body.password)
  await user.save()

  res.status(201).json({ message: 'User created successfully', user: user.toJSON() })
}

// deleteUser() - permanently removes a user account
const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  await user.destroy()
  res.json({ message: 'User deleted successfully' })
}

module.exports = { createUser, deleteUser }
