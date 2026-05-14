const { sequelize, User, Category, FundraisingActivity, Donation } = require('./models')
const bcrypt = require('bcryptjs')

// Helper to create an activity then force-update its timestamps via raw SQL
// SQLite needs ISO format: YYYY-MM-DD HH:MM:SS.mmm
const toSQLiteDate = (d) => new Date(d).toISOString().replace('T', ' ').replace('Z', '')

const createActivity = async (data, createdAt, completedAt) => {
  const activity = await FundraisingActivity.create(data)
  const created = toSQLiteDate(createdAt)
  const updated = toSQLiteDate(completedAt || createdAt)
  await sequelize.query(
    `UPDATE fundraising_activities SET createdAt = '${created}', updatedAt = '${updated}' WHERE id = ${activity.id}`
  )
  return activity
}

const createDonation = async (data, donatedAt) => {
  const donation = await Donation.create(data)
  const ts = toSQLiteDate(donatedAt)
  await sequelize.query(
    `UPDATE donations SET createdAt = '${ts}', updatedAt = '${ts}' WHERE id = ${donation.id}`
  )
  return donation
}

async function seed() {
  await sequelize.sync({ force: true })

  // Users
  const admin = await User.create({ name: 'Admin', email: 'admin@fundraising.com', password_hash: bcrypt.hashSync('admin123', 10), role: 'user_admin' })
  const pm = await User.create({ name: 'Platform Manager', email: 'pm@fundraising.com', password_hash: bcrypt.hashSync('pm123', 10), role: 'platform_manager' })
  const fr = await User.create({ name: 'John Fund Raiser', email: 'john@fundraising.com', password_hash: bcrypt.hashSync('john123', 10), role: 'fund_raiser' })
  const donee = await User.create({ name: 'Jane Donee', email: 'jane@fundraising.com', password_hash: bcrypt.hashSync('jane123', 10), role: 'donee' })

  // Categories
  const categories = await Category.bulkCreate([
    { name: 'Medical', description: 'Health and medical causes' },
    { name: 'Education', description: 'Educational fundraisers' },
    { name: 'Environment', description: 'Environmental causes' },
    { name: 'Community', description: 'Community projects' },
    { name: 'Disaster Relief', description: 'Emergency and disaster relief' }
  ])

  const [medical, education, environment, community, disaster] = categories

  // ── Active (ongoing) activities ──
  const act1 = await createActivity({ title: 'Help Build a School', description: 'We are raising funds to build a school in a rural area that lacks educational resources.', goal_amount: 50000, current_amount: 12000, category_id: education.id, fund_raiser_id: fr.id, status: 'active' }, '2026-01-15')
  const act2 = await createActivity({ title: 'Medical Aid for Children', description: 'Support children who need urgent medical treatment and cannot afford healthcare.', goal_amount: 20000, current_amount: 8500, category_id: medical.id, fund_raiser_id: fr.id, status: 'active' }, '2026-02-10')
  const act3 = await createActivity({ title: 'Community Garden Project', description: 'Help us build a community garden to provide fresh produce to those in need.', goal_amount: 5000, current_amount: 3200, category_id: community.id, fund_raiser_id: fr.id, status: 'active' }, '2026-02-20')
  const act4 = await createActivity({ title: 'Reforestation Drive', description: 'Plant 10,000 trees across deforested land to restore the local ecosystem.', goal_amount: 15000, current_amount: 4100, category_id: environment.id, fund_raiser_id: fr.id, status: 'active' }, '2026-03-01')
  const act5 = await createActivity({ title: 'Clean Water for Rural Villages', description: 'Install water filtration systems in villages that rely on contaminated water sources.', goal_amount: 18000, current_amount: 6300, category_id: community.id, fund_raiser_id: fr.id, status: 'active' }, '2026-03-14')
  const act6 = await createActivity({ title: 'Emergency Shelter for Homeless Youth', description: 'Fund the setup of a temporary shelter providing beds, meals and support for homeless youth.', goal_amount: 35000, current_amount: 11200, category_id: disaster.id, fund_raiser_id: fr.id, status: 'active' }, '2026-03-25')
  const act7 = await createActivity({ title: 'Wheelchair Access Ramps Project', description: 'Build wheelchair access ramps in public buildings and community centres across the city.', goal_amount: 12000, current_amount: 9800, category_id: medical.id, fund_raiser_id: fr.id, status: 'active' }, '2026-04-05')
  const act8 = await createActivity({ title: 'Free Coding Bootcamp for Teens', description: 'Sponsor a 3-month coding bootcamp for underprivileged teenagers to build tech skills.', goal_amount: 22000, current_amount: 7500, category_id: education.id, fund_raiser_id: fr.id, status: 'active' }, '2026-04-18')
  const act9 = await createActivity({ title: 'Ocean Plastic Cleanup Campaign', description: 'Fund a team of divers and boats to remove plastic waste from the coastal waters.', goal_amount: 40000, current_amount: 18600, category_id: environment.id, fund_raiser_id: fr.id, status: 'active' }, '2026-05-01')

  // ── Completed activities ──
  const comp1 = await createActivity({ title: 'Flood Relief Fund', description: 'Emergency relief for families affected by recent floods.', goal_amount: 30000, current_amount: 30000, category_id: disaster.id, fund_raiser_id: fr.id, status: 'completed' }, '2025-10-01', '2025-11-30')
  const comp2 = await createActivity({ title: 'Laptop Fund for Students', description: 'Raise funds to provide laptops to underprivileged university students.', goal_amount: 10000, current_amount: 10000, category_id: education.id, fund_raiser_id: fr.id, status: 'completed' }, '2025-11-01', '2025-12-20')
  const comp3 = await createActivity({ title: 'Free Eye Clinic Campaign', description: 'Fund a free eye clinic for seniors in low-income neighbourhoods.', goal_amount: 8000, current_amount: 9200, category_id: medical.id, fund_raiser_id: fr.id, status: 'completed' }, '2025-12-05', '2026-02-10')
  const comp4 = await createActivity({ title: 'Solar Panels for Village School', description: 'Install solar panels to power a school that has no electricity access.', goal_amount: 25000, current_amount: 25000, category_id: education.id, fund_raiser_id: fr.id, status: 'completed' }, '2026-01-10', '2026-03-28')

  // ── Donations with varied dates (for testing Donation History search) ──
  // Jan 2026
  await createDonation({ donee_id: donee.id, activity_id: act1.id, amount: 100 }, '2026-01-20')   // Education
  await createDonation({ donee_id: donee.id, activity_id: comp4.id, amount: 75  }, '2026-01-28')  // Education (completed)
  // Feb 2026
  await createDonation({ donee_id: donee.id, activity_id: act2.id, amount: 50  }, '2026-02-05')   // Medical
  await createDonation({ donee_id: donee.id, activity_id: act3.id, amount: 30  }, '2026-02-15')   // Community
  await createDonation({ donee_id: donee.id, activity_id: comp3.id, amount: 120 }, '2026-02-22')  // Medical (completed)
  // Mar 2026
  await createDonation({ donee_id: donee.id, activity_id: act4.id, amount: 80  }, '2026-03-03')   // Environment
  await createDonation({ donee_id: donee.id, activity_id: act5.id, amount: 60  }, '2026-03-17')   // Community
  await createDonation({ donee_id: donee.id, activity_id: act6.id, amount: 200 }, '2026-03-30')   // Disaster Relief
  // Apr 2026
  await createDonation({ donee_id: donee.id, activity_id: act7.id, amount: 45  }, '2026-04-08')   // Medical
  await createDonation({ donee_id: donee.id, activity_id: act8.id, amount: 90  }, '2026-04-20')   // Education
  // May 2026
  await createDonation({ donee_id: donee.id, activity_id: act9.id, amount: 150 }, '2026-05-05')   // Environment
  await createDonation({ donee_id: donee.id, activity_id: act1.id, amount: 25  }, '2026-05-09')   // Education (2nd donation)

  console.log('✅ Database seeded successfully!')
  console.log('----------------------------')
  console.log('Test accounts:')
  console.log('  User Admin   → admin@fundraising.com / admin123')
  console.log('  Platform Mgr → pm@fundraising.com / pm123')
  console.log('  Fund Raiser  → john@fundraising.com / john123')
  console.log('  Donee        → jane@fundraising.com / jane123')
  console.log('----------------------------')
  console.log('Active campaigns:   9 (started Jan–Sep 2025, mixed categories)')
  console.log('Completed campaigns: 4 (Jan-Feb, Feb-Mar, Mar-Apr, Mar-May 2025)')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
