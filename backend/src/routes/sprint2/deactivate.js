// Sprint 2 - Story #59 (UA03) - Deactivate User Accounts
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { registerSelectedUser, deactivateUserSelection, reactivateUser } = require('../../controllers/sprint2/deactivateUserController')

// GET /api/deactivate/:id - get user record before deactivation (user_admin only)
router.get('/:id', authenticate, requireRole('user_admin'), registerSelectedUser)

// PATCH /api/deactivate/:id - deactivate selected user account
router.patch('/:id', authenticate, requireRole('user_admin'), deactivateUserSelection)

// PATCH /api/deactivate/:id/reactivate - reactivate an inactive user account
router.patch('/:id/reactivate', authenticate, requireRole('user_admin'), reactivateUser)

module.exports = router
