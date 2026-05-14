const { FundraisingActivity, Donation, Category } = require('../../models')

// Story #6 - DonationUI: displayActivityDetails() - fetch active activities for donee to view
const displayActivityDetails = async (req, res) => {
  const activities = await FundraisingActivity.findAll({
    where: { status: 'active' },
    include: [{ model: Category, as: 'category', attributes: ['name'] }],
    order: [['createdAt', 'DESC']]
  })
  res.json({ activities })
}

// Story #6 - DonationController: processDonation()
// Internally handles: validatePayment() → createDonation() → updateActivityAmount() → sendConfirmation()
const processDonation = async (req, res) => {
  const { activity_id, amount, payment_method } = req.body
  const donee_id = req.user.id

  // validatePayment()
  if (!activity_id) return res.status(400).json({ error: 'Activity is required' })
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return res.status(400).json({ error: 'Amount must be a positive number' })
  if (!payment_method) return res.status(400).json({ error: 'Payment method is required' })

  const activity = await FundraisingActivity.findByPk(activity_id)
  if (!activity) return res.status(404).json({ error: 'Fundraising activity not found' })
  if (activity.status !== 'active') return res.status(400).json({ error: 'This activity is no longer accepting donations' })

  // createDonation()
  const donation = await Donation.create({ donee_id, activity_id, amount: parseFloat(amount) })

  // updateActivityAmount()
  activity.current_amount = parseFloat(activity.current_amount) + parseFloat(amount)
  await activity.save()

  // sendConfirmation()
  res.status(201).json({
    message: 'Donation successful! Thank you for your contribution.',
    donation,
    newTotal: activity.current_amount
  })
}

module.exports = { displayActivityDetails, processDonation }
