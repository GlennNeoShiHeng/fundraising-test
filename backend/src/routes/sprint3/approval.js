// Sprint 3 - Story #34 (PA06) - Approve or Reject Fundraising Activities (Platform Manager)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { getPendingActivities, getAllActivitiesForReview, approveActivity, rejectActivity } = require('../../controllers/sprint3/approvalController')

// GET /api/approval/pending - list activities awaiting approval
router.get('/pending', authenticate, requireRole('platform_manager'), getPendingActivities)

// GET /api/approval/all - list all activities with their approval status
router.get('/all', authenticate, requireRole('platform_manager'), getAllActivitiesForReview)

// PUT /api/approval/:id/approve - approve an activity
router.put('/:id/approve', authenticate, requireRole('platform_manager'), approveActivity)

// PUT /api/approval/:id/reject - reject an activity with a reason
router.put('/:id/reject', authenticate, requireRole('platform_manager'), rejectActivity)

module.exports = router
