// Sprint 2 - Story #8 (DO05) - Save Fundraising Campaign to Favourites
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { processSaveFavourite, removeFavourite, getFavourites } = require('../../controllers/sprint2/favouriteController')

// GET /api/favourites - get all saved favourites for logged-in donee
router.get('/', authenticate, requireRole('donee'), getFavourites)

// POST /api/favourites - save activity to favourites
router.post('/', authenticate, requireRole('donee'), processSaveFavourite)

// DELETE /api/favourites/:activity_id - remove activity from favourites
router.delete('/:activity_id', authenticate, requireRole('donee'), removeFavourite)

module.exports = router
