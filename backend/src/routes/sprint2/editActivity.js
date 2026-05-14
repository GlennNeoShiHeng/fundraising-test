// Sprint 2 - Story #23 (FR02) - Edit Fundraising Activity (Fund Raiser)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { editActivity, getActivityById } = require('../../controllers/sprint2/editActivityController')

// GET /api/edit-activity/:id - load activity for editing (fund_raiser only)
router.get('/:id', authenticate, requireRole('fund_raiser'), getActivityById)

// PUT /api/edit-activity/:id - submit edited activity details
router.put('/:id', authenticate, requireRole('fund_raiser'), editActivity)

module.exports = router
