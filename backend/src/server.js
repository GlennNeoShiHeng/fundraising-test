const express = require('express')
const cors = require('cors')
const { sequelize } = require('./models')
const { PORT } = require('./config')

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean)
    if (!origin || allowed.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())

// Auth (shared)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/feedback', require('./routes/feedback'))

// Sprint 1
app.use('/api/users', require('./routes/sprint1/users'))
app.use('/api/categories', require('./routes/sprint1/categories'))
app.use('/api/donations', require('./routes/sprint1/donations'))
app.use('/api/activities', require('./routes/sprint1/activities'))

// Sprint 2
app.use('/api/search', require('./routes/sprint2/search'))
app.use('/api/contributions', require('./routes/sprint2/contributions'))
app.use('/api/deactivate', require('./routes/sprint2/deactivate'))
app.use('/api/activity-details', require('./routes/sprint2/activityDetails'))
app.use('/api/favourites', require('./routes/sprint2/favourites'))
app.use('/api/history', require('./routes/sprint2/history'))
app.use('/api/filter', require('./routes/sprint2/filter'))
app.use('/api/edit-activity', require('./routes/sprint2/editActivity'))
app.use('/api/donation-history', require('./routes/sprint2/donationSearch'))

// Sprint 3
app.use('/api/metrics', require('./routes/sprint3/metrics'))
app.use('/api/manage-activity', require('./routes/sprint3/manageActivity'))
app.use('/api/reports', require('./routes/sprint3/reports'))
app.use('/api/announcements', require('./routes/sprint3/announcements'))
app.use('/api/approval', require('./routes/sprint3/approval'))
app.use('/api/recurring-donations', require('./routes/sprint3/recurringDonations'))
app.use('/api/recommendations', require('./routes/sprint3/recommendations'))

app.get('/', (req, res) => res.json({ message: 'Fundraising API is running' }))

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`)
  })
})
