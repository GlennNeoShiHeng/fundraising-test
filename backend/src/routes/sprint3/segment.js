// Sprint 3 - Story #22 (FR-22) - Identify and Segment Interested Users (Fund Raiser)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { getActivitiesList, analyseUserInterest } = require('../../controllers/sprint3/segmentController')

// GET /api/segment/activities - list of fund raiser's activities for the dropdown
router.get('/activities', authenticate, requireRole('fund_raiser'), getActivitiesList)

// GET /api/segment/:activityId - segmented users (donors + favouriters) for a specific activity
router.get('/:activityId', authenticate, requireRole('fund_raiser'), analyseUserInterest)

module.exports = router
