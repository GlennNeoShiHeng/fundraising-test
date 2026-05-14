const express = require('express')
const router = express.Router()
const { getCategories, submitCategory } = require('../../controllers/sprint1/createCategoryController')   // Story #42
const { editCategory } = require('../../controllers/sprint1/editCategoryController')                      // Story #43
const { deleteCategory } = require('../../controllers/sprint1/deleteCategoryController')                  // Story #44
const { authenticate, requireRole } = require('../../middleware/auth')

router.get('/', authenticate, getCategories)                                                               // All roles can view
router.post('/', authenticate, requireRole('platform_manager'), submitCategory)                           // Story #42
router.put('/:id', authenticate, requireRole('platform_manager'), editCategory)                           // Story #43
router.delete('/:id', authenticate, requireRole('platform_manager'), deleteCategory)                      // Story #44

module.exports = router
