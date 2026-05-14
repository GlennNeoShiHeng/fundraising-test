const express = require('express')
const router = express.Router()
const { createUser, deleteUser } = require('../../controllers/sprint1/userController')  // Story #48
const { retrieveUserList, retrieveUserData } = require('../../controllers/sprint1/viewUserController')    // Story #57
const { validateUser } = require('../../controllers/sprint1/searchUserController')     // Story #57
const { authenticate, requireRole } = require('../../middleware/auth')

router.get('/', authenticate, requireRole('user_admin'), retrieveUserList)             // Story #57
router.post('/', authenticate, requireRole('user_admin'), createUser)                  // Story #48
router.get('/search', authenticate, requireRole('user_admin'), validateUser)           // Story #57
router.get('/:id', authenticate, requireRole('user_admin'), retrieveUserData)          // Story #57
router.delete('/:id', authenticate, requireRole('user_admin'), deleteUser)             // Delete user

module.exports = router
