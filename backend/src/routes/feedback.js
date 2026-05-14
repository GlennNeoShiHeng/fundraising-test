const express = require('express')
const router = express.Router()
const { submitFeedback, getTrends } = require('../controllers/feedbackController')
const { authenticate, requireRole } = require('../middleware/auth')

router.post('/', authenticate, submitFeedback)
router.get('/trends', authenticate, requireRole('platform_manager'), getTrends)

module.exports = router
