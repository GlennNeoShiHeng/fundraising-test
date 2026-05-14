const { Category, FundraisingActivity } = require('../../models')

// Story #44 - DeleteCategoryController: getCategories() + validateCategory() + deleteCategory() + logDeletion()
const deleteCategory = async (req, res) => {
  const { id } = req.params

  // validateCategory() - check it exists
  const category = await Category.findByPk(id)
  if (!category) return res.status(404).json({ error: 'Category not found' })

  // checkDependencies() - isInUse()
  const linkedActivities = await FundraisingActivity.count({ where: { category_id: id } })
  if (linkedActivities > 0) {
    return res.status(400).json({ error: 'Category is in use and cannot be deleted' })
  }

  // deleteCategory() on entity
  await category.destroy()

  // logDeletion()
  console.log(`[AuditLog] Category "${category.name}" (id: ${id}) deleted by user ${req.user?.id} at ${new Date().toISOString()}`)

  res.json({ message: 'Category deleted successfully' })
}

module.exports = { deleteCategory }
