// Sprint 2 - Story #12 (DO02) - Search Fundraising Activities
const express = require('express')
const router = express.Router()
const { searchFundraisers, getCategories } = require('../../controllers/sprint2/searchFundraisingController')

// GET /api/search?keyword=&category_id=&date=
router.get('/', searchFundraisers)
// GET /api/search/categories
router.get('/categories', getCategories)

module.exports = router
