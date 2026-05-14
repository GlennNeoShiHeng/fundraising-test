// Story #13 (D007) - Set Up Monthly Recurring Donations (Donee)
// BCE Control: RecurringDonationController
const { RecurringDonation, FundraisingActivity, Category, Donation } = require('../../models')

// validateRecurringDonationDetails() - validates form inputs for a recurring donation
const validateRecurringDonationDetails = ({ activity_id, amount, start_date, payment_method }) => {
  if (!activity_id) return { valid: false, error: 'Please select a fundraising campaign' }
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return { valid: false, error: 'Donation amount must be a positive number' }
  if (!start_date) return { valid: false, error: 'Start date is required' }
  if (!payment_method || !payment_method.trim()) return { valid: false, error: 'Payment method is required' }
  return { valid: true }
}

// calculateNextPaymentDate() - determines the next monthly payment date from the start date
const calculateNextPaymentDate = (start_date) => {
  const date = new Date(start_date)
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().split('T')[0]
}

// setupRecurringDonation() - creates a recurring donation record and initial donation
const setupRecurringDonation = async (req, res) => {
  const donee_id = req.user.id
  const { activity_id, amount, start_date, payment_method } = req.body

  const validation = validateRecurringDonationDetails({ activity_id, amount, start_date, payment_method })
  if (!validation.valid) return res.status(400).json({ error: validation.error })

  const activity = await FundraisingActivity.findByPk(activity_id)
  if (!activity) return res.status(404).json({ error: 'Fundraising campaign not found' })
  if (activity.status !== 'active') return res.status(400).json({ error: 'This campaign is no longer active' })

  // Check if already has an active recurring donation for this activity
  const existing = await RecurringDonation.findOne({ where: { donee_id, activity_id, is_active: true } })
  if (existing) return res.status(400).json({ error: 'You already have an active recurring donation for this campaign' })

  const next_payment_date = calculateNextPaymentDate(start_date)

  // Save recurring donation record
  const recurringDonation = await RecurringDonation.create({
    donee_id,
    activity_id,
    amount: parseFloat(amount),
    frequency: 'monthly',
    start_date,
    next_payment_date,
    payment_method,
    is_active: true
  })

  // Create initial donation record and update campaign total
  await Donation.create({ donee_id, activity_id, amount: parseFloat(amount) })
  await activity.update({ current_amount: parseFloat(activity.current_amount) + parseFloat(amount) })

  res.status(201).json({ message: 'Recurring donation set up successfully', recurringDonation })
}

// getMyRecurringDonations() - retrieves all recurring donations for the logged-in donee
const getMyRecurringDonations = async (req, res) => {
  const donee_id = req.user.id

  const records = await RecurringDonation.findAll({
    where: { donee_id },
    order: [['createdAt', 'DESC']]
  })

  const result = await Promise.all(records.map(async (r) => {
    const activity = await FundraisingActivity.findByPk(r.activity_id)
    const cat = activity && activity.category_id ? await Category.findByPk(activity.category_id) : null
    return {
      id: r.id,
      activity_id: r.activity_id,
      activity_title: activity ? activity.title : 'Unknown Campaign',
      category: cat ? cat.name : 'Uncategorised',
      amount: parseFloat(r.amount),
      frequency: r.frequency,
      start_date: r.start_date,
      next_payment_date: r.next_payment_date,
      payment_method: r.payment_method,
      is_active: r.is_active,
      createdAt: r.createdAt
    }
  }))

  res.json(result)
}

// cancelRecurringDonation() - deactivates a recurring donation so no further payments are made
const cancelRecurringDonation = async (req, res) => {
  const donee_id = req.user.id
  const { id } = req.params

  const record = await RecurringDonation.findOne({ where: { id, donee_id } })
  if (!record) return res.status(404).json({ error: 'Recurring donation not found' })
  if (!record.is_active) return res.status(400).json({ error: 'This recurring donation is already cancelled' })

  await record.update({ is_active: false })
  res.json({ message: 'Recurring donation cancelled successfully' })
}

module.exports = { setupRecurringDonation, getMyRecurringDonations, cancelRecurringDonation, validateRecurringDonationDetails, calculateNextPaymentDate }
