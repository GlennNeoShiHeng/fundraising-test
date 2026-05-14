// Sprint 3 - Story #13 (D007) - Set Up Monthly Recurring Donations (Donee)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { setupRecurringDonation, getMyRecurringDonations, cancelRecurringDonation } = require('../../controllers/sprint3/recurringDonationController')

// POST /api/recurring-donations - donee sets up a new recurring donation
router.post('/', authenticate, requireRole('donee'), setupRecurringDonation)

// GET /api/recurring-donations - donee views their recurring donations
router.get('/', authenticate, requireRole('donee'), getMyRecurringDonations)

// DELETE /api/recurring-donations/:id - donee cancels a recurring donation
router.delete('/:id', authenticate, requireRole('donee'), cancelRecurringDonation)

module.exports = router
