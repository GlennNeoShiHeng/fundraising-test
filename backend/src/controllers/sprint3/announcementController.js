// Story #47 (PA05) - Send System-Wide Announcements (Platform Manager)
// BCE Control: AnnouncementController
const { Announcement, User } = require('../../models')

// validateAnnouncementInput() - checks that title and content are present
const validateAnnouncementInput = ({ title, content }) => {
  if (!title || !title.trim()) return { valid: false, error: 'Title is required' }
  if (!content || !content.trim()) return { valid: false, error: 'Content is required' }
  return { valid: true }
}

// createAnnouncement() - saves a new announcement created by the Platform Manager
const createAnnouncement = async (req, res) => {
  const { title, content } = req.body
  const created_by = req.user.id

  const validation = validateAnnouncementInput({ title, content })
  if (!validation.valid) return res.status(400).json({ error: validation.error })

  const announcement = await Announcement.create({
    title: title.trim(),
    content: content.trim(),
    created_by
  })

  res.status(201).json({ message: 'Announcement sent successfully', announcement })
}

// getAnnouncements() - retrieves all announcements for display to all users
const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.findAll({
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'creator', attributes: ['name'] }]
  })

  res.json(announcements.map(a => ({
    id: a.id,
    title: a.title,
    content: a.content,
    createdBy: a.creator ? a.creator.name : 'Platform Manager',
    createdAt: a.createdAt
  })))
}

// deleteAnnouncement() - removes an announcement (Platform Manager only)
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params
  const announcement = await Announcement.findByPk(id)
  if (!announcement) return res.status(404).json({ error: 'Announcement not found' })

  await announcement.destroy()
  res.json({ message: 'Announcement deleted successfully' })
}

module.exports = { createAnnouncement, getAnnouncements, deleteAnnouncement, validateAnnouncementInput }
