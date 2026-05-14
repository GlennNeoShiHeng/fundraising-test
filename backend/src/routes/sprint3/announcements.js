// Sprint 3 - Story #47 (PA05) - System-Wide Announcements (Platform Manager)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../../controllers/sprint3/announcementController')

// GET /api/announcements - all authenticated users can view announcements
router.get('/', authenticate, getAnnouncements)

// POST /api/announcements - platform manager creates an announcement
router.post('/', authenticate, requireRole('platform_manager'), createAnnouncement)

// DELETE /api/announcements/:id - platform manager removes an announcement
router.delete('/:id', authenticate, requireRole('platform_manager'), deleteAnnouncement)

module.exports = router
