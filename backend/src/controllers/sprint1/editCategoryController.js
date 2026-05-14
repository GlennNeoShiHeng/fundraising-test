const { Category } = require('../../models')

// Story #43 - EditCategoryController: selectCategory() + editCategory() + validateCategoryName() + saveChanges()
const editCategory = async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body

  // selectCategory()
  const category = await Category.findByPk(id)
  if (!category) return res.status(404).json({ error: 'Category not found' })

  // validateCategoryName()
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' })
  const duplicate = await Category.findOne({ where: { name: name.trim() } })
  if (duplicate && duplicate.id !== category.id) return res.status(400).json({ error: 'Category name already exists' })

  // saveChanges()
  category.name = name.trim()
  if (description !== undefined) category.description = description.trim()
  await category.save()

  res.json({ message: 'Category updated successfully', category })
}

module.exports = { editCategory }
