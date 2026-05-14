// Sprint 2 - Story #7 (DO04) - View Fundraising Activity Details and Progress
const express = require('express')
const router = express.Router()
const { retrieveActivityDetails } = require('../../controllers/sprint2/viewActivityController')

// GET /api/activity-details/:id - public route (any user can view activity details)
router.get('/:id', retrieveActivityDetails)

module.exports = router
