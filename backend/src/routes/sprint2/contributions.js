// Sprint 2 - Story #27 (DO03) - View Progress of Contributed Activities
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { getContributedActivities } = require('../../controllers/sprint2/donationHistoryController')

// GET /api/contributions - donee only
router.get('/', authenticate, requireRole('donee'), getContributedActivities)

module.exports = router
