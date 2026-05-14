// Sprint 3 - Story #24 (FR-07) - Delete or Cancel Fundraising Activity (Fund Raiser)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { deleteActivity, cancelActivity } = require('../../controllers/sprint3/deleteActivityController')

// DELETE /api/manage-activity/:activityId - permanently delete an activity
router.delete('/:activityId', authenticate, requireRole('fund_raiser'), deleteActivity)

// PATCH /api/manage-activity/:activityId/cancel - set status to cancelled
router.patch('/:activityId/cancel', authenticate, requireRole('fund_raiser'), cancelActivity)

module.exports = router
