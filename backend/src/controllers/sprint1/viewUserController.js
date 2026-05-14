const { User } = require('../../models')

// Story #57 - ViewUserAccountController: retrieveUserList()
const retrieveUserList = async (req, res) => {
  const users = await User.findAll({ order: [['createdAt', 'DESC']] })
  res.json({ users: users.map(u => u.toJSON()) })
}

// Story #57 - ViewUserAccountController: retrieveUserData()
const retrieveUserData = async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: user.toJSON() })
}

module.exports = { retrieveUserList, retrieveUserData }
