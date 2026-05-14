const express = require('express')
const router = express.Router()
const { getDonationHistory } = require('../../controllers/sprint2/donationController')
const { authenticate } = require('../../middleware/auth')

router.get('/history', authenticate, getDonationHistory)

module.exports = router
