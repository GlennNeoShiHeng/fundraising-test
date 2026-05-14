const express = require('express')
const router = express.Router()
const { getCategories, createActivity, browseActivities } = require('../../controllers/sprint1/activityController')
const { authenticate, requireRole } = require('../../middleware/auth')

router.get('/browse', browseActivities)                                               // Public - no auth needed
router.get('/categories', authenticate, requireRole('fund_raiser'), getCategories)    // Story #30
router.post('/', authenticate, requireRole('fund_raiser'), createActivity)            // Story #30

module.exports = router
