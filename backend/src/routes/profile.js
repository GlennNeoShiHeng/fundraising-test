const express = require('express')
const router = express.Router()
const { getProfile, saveProfile } = require('../controllers/profileController')
const { authenticate } = require('../middleware/auth')

router.get('/', authenticate, getProfile)
router.post('/', authenticate, saveProfile)

module.exports = router
