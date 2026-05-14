// Sprint 3 - Story #38 (PM-06) - Generate Fundraising Reports (Platform Manager)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { generateReport } = require('../../controllers/sprint3/reportController')

// GET /api/reports?category_id=&timePeriod= - platform manager only
router.get('/', authenticate, requireRole('platform_manager'), generateReport)

module.exports = router
