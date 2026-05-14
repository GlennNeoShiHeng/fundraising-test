const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config')
const { User } = require('../models')

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findByEmail(email)
  if (!user || !user.checkPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  if (!user.is_active) {
    return res.status(403).json({ error: 'Account is deactivated' })
  }
  // Staff accounts must use Staff Login
  if (user.isStaff()) {
    return res.status(403).json({ error: 'Staff accounts must use Staff Login' })
  }
  const token = generateToken(user)
  res.json({ token, user: user.toJSON() })
}

const staffLogin = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findByEmail(email)
  if (!user || !user.checkPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  if (!user.is_active) {
    return res.status(403).json({ error: 'Account is deactivated' })
  }
  if (!user.isStaff()) {
    return res.status(403).json({ error: 'This account does not have staff access' })
  }
  const token = generateToken(user)
  res.json({ token, user: user.toJSON() })
}

module.exports = { login, staffLogin }
