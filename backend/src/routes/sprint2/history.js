// Sprint 2 - Story #20 (FR04) - View Completed Activity History (Fund Raiser)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { searchCompletedFRAs } = require('../../controllers/sprint2/historyController')

// GET /api/history/completed?category_id=&startDate=&endDate= - fund_raiser only
router.get('/completed', authenticate, requireRole('fund_raiser'), searchCompletedFRAs)

module.exports = router
