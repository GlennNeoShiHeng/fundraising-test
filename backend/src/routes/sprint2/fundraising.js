const express = require('express')
const router = express.Router()
const { searchFundraisers, getCategories } = require('../../controllers/sprint2/fundraisingController')

router.get('/search', searchFundraisers)
router.get('/categories', getCategories)

module.exports = router
