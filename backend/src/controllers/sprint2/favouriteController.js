// Story #8 (DO05) - Save Fundraising Campaign to Favourites (Donee)
// BCE Control: FavouriteController
const { Favourite, FundraisingActivity, Category } = require('../../models')

// validateUser() - checks that the requesting user is authenticated
const validateUser = (req) => {
  return req.user && req.user.id
}

// addToFavourites() - adds the activity to the donee's FavouriteList entity
const addToFavourites = (donee_id, activity_id) => {
  return Favourite.addActivity(donee_id, activity_id)
}

// processSaveFavourite() - validates user and saves activity to favourites
const processSaveFavourite = async (req, res) => {
  if (!validateUser(req)) return res.status(401).json({ error: 'Unauthorised' })
  const donee_id = req.user.id
  const { activity_id } = req.body

  const activity = await FundraisingActivity.findByPk(activity_id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })

  // Prevent duplicate saves
  const existing = await Favourite.findOne({ where: { donee_id, activity_id } })
  if (existing) return res.status(409).json({ error: 'Activity already saved to favourites' })

  await addToFavourites(donee_id, activity_id)
  res.json({ message: 'Activity saved to favourites successfully' })
}

// removeFavourite() - removes an activity from favourites
const removeFavourite = async (req, res) => {
  if (!validateUser(req)) return res.status(401).json({ error: 'Unauthorised' })
  const donee_id = req.user.id
  const { activity_id } = req.params
  await Favourite.removeActivity(donee_id, activity_id)
  res.json({ message: 'Activity removed from favourites' })
}

// getFavourites() - retrieves the donee's full favourites list with activity details
const getFavourites = async (req, res) => {
  if (!validateUser(req)) return res.status(401).json({ error: 'Unauthorised' })
  const donee_id = req.user.id
  const favourites = await Favourite.getFavourites(donee_id)

  const result = await Promise.all(favourites.map(async (fav) => {
    const activity = await FundraisingActivity.findByPk(fav.activity_id)
    if (!activity) return null
    const cat = activity.category_id ? await Category.findByPk(activity.category_id) : null
    const progress = activity.getProgress()
    return {
      favourite_id: fav.id,
      activity_id: activity.id,
      title: activity.title,
      description: activity.description,
      goal_amount: activity.goal_amount,
      current_amount: activity.current_amount,
      progress,
      category: cat ? cat.name : 'Uncategorised',
      status: activity.status
    }
  }))

  res.json(result.filter(Boolean))
}

module.exports = { processSaveFavourite, removeFavourite, getFavourites, validateUser, addToFavourites }
