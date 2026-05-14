// Sprint 2 - Story #21 (FR05) - Filter Ongoing Fundraising Activities (Fund Raiser)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { filterActiveFRAs } = require('../../controllers/sprint2/filterController')

// GET /api/filter/ongoing?category_id=&startDate=&endDate= - fund_raiser only
router.get('/ongoing', authenticate, requireRole('fund_raiser'), filterActiveFRAs)

module.exports = router
