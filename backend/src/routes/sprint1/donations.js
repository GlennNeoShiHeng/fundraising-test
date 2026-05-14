const express = require('express')
const router = express.Router()
const { displayActivityDetails, processDonation } = require('../../controllers/sprint1/donationController')
const { authenticate, requireRole } = require('../../middleware/auth')

router.get('/activities', authenticate, requireRole('donee'), displayActivityDetails)  // Story #6
router.post('/donate', authenticate, requireRole('donee'), processDonation)            // Story #6

module.exports = router
