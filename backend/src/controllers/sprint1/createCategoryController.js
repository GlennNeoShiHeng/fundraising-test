const { Category } = require('../../models')

// Story #42 - Get all categories (used to updateCategoryList after creation)
const getCategories = async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] })
  res.json({ categories })
}

// Story #42 - CategoryController: validateCategoryName() + submitCategory()
const submitCategory = async (req, res) => {
  const { name, description } = req.body

  // validateCategoryName()
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' })
  const existing = await Category.findOne({ where: { name: name.trim() } })
  if (existing) return res.status(400).json({ error: 'Category name already exists' })

  // createCategory() on entity + updateCategoryList()
  const category = await Category.create({ name: name.trim(), description: description?.trim() || '' })
  res.status(201).json({ message: 'Category created successfully', category })
}

module.exports = { getCategories, submitCategory }
