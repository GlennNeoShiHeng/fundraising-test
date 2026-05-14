const sequelize = require('../database')
const User = require('./User')
const DoneeProfile = require('./DoneeProfile')
const Category = require('./Category')
const FundraisingActivity = require('./FundraisingActivity')
const Donation = require('./Donation')
const Feedback = require('./Feedback')
const IssueTrend = require('./IssueTrend')
const Favourite = require('./Favourite')
const Announcement = require('./Announcement')
const RecurringDonation = require('./RecurringDonation')

// Associations
User.hasOne(DoneeProfile, { foreignKey: 'user_id', as: 'profile' })
DoneeProfile.belongsTo(User, { foreignKey: 'user_id' })

Category.hasMany(FundraisingActivity, { foreignKey: 'category_id', as: 'activities' })
FundraisingActivity.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

User.hasMany(FundraisingActivity, { foreignKey: 'fund_raiser_id', as: 'campaigns' })
FundraisingActivity.belongsTo(User, { foreignKey: 'fund_raiser_id', as: 'fundRaiser' })

User.hasMany(Donation, { foreignKey: 'donee_id', as: 'donations' })
Donation.belongsTo(User, { foreignKey: 'donee_id', as: 'donee' })

FundraisingActivity.hasMany(Donation, { foreignKey: 'activity_id', as: 'donations' })
Donation.belongsTo(FundraisingActivity, { foreignKey: 'activity_id', as: 'activity' })

User.hasMany(Feedback, { foreignKey: 'donee_id', as: 'feedbacks' })
Feedback.belongsTo(User, { foreignKey: 'donee_id', as: 'donee' })

// Story #8 - Favourites associations
User.hasMany(Favourite, { foreignKey: 'donee_id', as: 'favourites' })
Favourite.belongsTo(User, { foreignKey: 'donee_id', as: 'donee' })

FundraisingActivity.hasMany(Favourite, { foreignKey: 'activity_id', as: 'favouritedBy' })
Favourite.belongsTo(FundraisingActivity, { foreignKey: 'activity_id', as: 'activity' })

// Story #47 (PA05) - Announcement associations
User.hasMany(Announcement, { foreignKey: 'created_by', as: 'announcements' })
Announcement.belongsTo(User, { foreignKey: 'created_by', as: 'creator' })

// Story #13 (D007) - Recurring Donation associations
User.hasMany(RecurringDonation, { foreignKey: 'donee_id', as: 'recurringDonations' })
RecurringDonation.belongsTo(User, { foreignKey: 'donee_id', as: 'donee' })

FundraisingActivity.hasMany(RecurringDonation, { foreignKey: 'activity_id', as: 'recurringDonations' })
RecurringDonation.belongsTo(FundraisingActivity, { foreignKey: 'activity_id', as: 'activity' })

module.exports = { sequelize, User, DoneeProfile, Category, FundraisingActivity, Donation, Feedback, IssueTrend, Favourite, Announcement, RecurringDonation }
