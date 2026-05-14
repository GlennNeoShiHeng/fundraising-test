// Sprint 3 - Story #10 (DN-09) - Recommended Fundraising Campaigns (Donee)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { getRecommendations } = require('../../controllers/sprint3/recommendationController')

// GET /api/recommendations - personalised campaign recommendations for the donee
router.get('/', authenticate, requireRole('donee'), getRecommendations)

module.exports = router
