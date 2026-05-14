// Sprint 2 - Story #3 (DO06) - Search and View Donation History (Donee)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { searchHistory } = require('../../controllers/sprint2/donationSearchController')

// GET /api/donation-history?category_id=&startDate=&endDate= - donee only
router.get('/', authenticate, requireRole('donee'), searchHistory)

module.exports = router
