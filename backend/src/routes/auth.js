const express = require('express')
const router = express.Router()
const { login, staffLogin } = require('../controllers/authController')

router.post('/login', login)
router.post('/staff-login', staffLogin)

module.exports = router
