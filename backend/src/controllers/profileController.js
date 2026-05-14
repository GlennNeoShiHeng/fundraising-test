const { DoneeProfile } = require('../models')

const getProfile = async (req, res) => {
  const profile = await DoneeProfile.findOne({ where: { user_id: req.user.id } })
  res.json({ profile: profile || null })
}

const saveProfile = async (req, res) => {
  const { name, email, phone_number, address, date_of_birth } = req.body
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ errors: ['Name and email are required'] })
  }

  let profile = await DoneeProfile.findOne({ where: { user_id: req.user.id } })
  if (profile) {
    await profile.update({ name, email, phone_number, address, date_of_birth })
    return res.json({ message: 'Profile updated successfully', profile })
  }

  profile = await DoneeProfile.create({ user_id: req.user.id, name, email, phone_number, address, date_of_birth })
  res.status(201).json({ message: 'Profile created successfully', profile })
}

module.exports = { getProfile, saveProfile }
