const { FundraisingActivity, Category } = require('../../models')

// Public browse - all active activities (no auth required)
const browseActivities = async (req, res) => {
  const activities = await FundraisingActivity.findAll({
    where: { status: 'active' },
    include: [{ model: Category, as: 'category', attributes: ['name'] }],
    order: [['createdAt', 'DESC']]
  })
  res.json({ activities })
}

// Story #30 - FundraisingController: getCategories()
const getCategories = async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] })
  res.json({ categories })
}

// Story #30 - ActivityController: validateDetails() + createActivity()
const createActivity = async (req, res) => {
  const { title, description, goalAmount, categoryId } = req.body
  const fund_raiser_id = req.user.id

  // validateDetails()
  const errors = []
  if (!title || !title.trim()) errors.push('Title is required')
  if (!description || !description.trim()) errors.push('Description is required')
  if (!goalAmount || isNaN(goalAmount) || parseFloat(goalAmount) <= 0) errors.push('Goal amount must be a positive number')
  if (!categoryId) errors.push('Category is required')
  if (errors.length) return res.status(400).json({ errors })

  // save() on FundraisingActivity entity
  const activity = await FundraisingActivity.create({
    title: title.trim(),
    description: description.trim(),
    goal_amount: parseFloat(goalAmount),
    current_amount: 0,
    category_id: categoryId,
    fund_raiser_id,
    status: 'active'
  })

  res.status(201).json({ message: 'Fundraising activity created successfully', activity })
}

module.exports = { getCategories, createActivity, browseActivities }
