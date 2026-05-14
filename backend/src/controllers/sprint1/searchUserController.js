const { User } = require('../../models')
const { Op } = require('sequelize')

// Story #57 - SearchUserAccountController: validateUser()
// Validates search input then retrieves matching user accounts
const validateUser = async (req, res) => {
  const { keyword } = req.query

  // validateSearchInput()
  if (!keyword || !keyword.trim()) {
    return res.status(400).json({ errors: ['Search keyword is required'] })
  }

  // searchUserAccount() - retrieveUserData()
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
        { role: { [Op.like]: `%${keyword}%` } }
      ]
    },
    order: [['createdAt', 'DESC']]
  })

  res.json({ users: users.map(u => u.toJSON()) })
}

module.exports = { validateUser }
