// Story #47 (PA05) - Send System-Wide Announcements (Platform Manager)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function AnnouncementsPage() {
  const { token } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const displayAnnouncementList = async () => {
    const res = await fetch(`${API}/announcements`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setAnnouncements(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (token) displayAnnouncementList() }, [token])

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const submitAnnouncement = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const res = await fetch(`${API}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) return showErrorMessage(data.error || 'Failed to send announcement')
    setForm({ title: '', content: '' })
    showSuccessMessage('Announcement sent to all users!')
    displayAnnouncementList()
  }

  const deleteAnnouncement = async (id) => {
    const res = await fetch(`${API}/announcements/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return showErrorMessage('Failed to delete announcement')
    showSuccessMessage('Announcement deleted.')
    displayAnnouncementList()
  }

  const showSuccessMessage = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  const showErrorMessage = (msg) => setError(msg)

  const formatDate = (d) => new Date(d).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={t.page('800px')}>
      {/* Admin Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(8,145,178,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>PLATFORM MANAGER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>System Announcements</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Send platform-wide notifications to all users.</p>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
            <div style={{ color: '#818cf8', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{announcements.length}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Announcements</div>
          </div>
        </div>
      </div>

      {success && (
        <div style={{ ...t.alertSuccess, marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}
      {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}

      {/* Compose form */}
      <div style={{ ...t.cardLg, marginBottom: '24px', border: '2px solid #e0f2fe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#ecfeff', borderRadius: '8px', padding: '6px 8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div style={t.sectionTitle}>New Announcement</div>
        </div>
        <form onSubmit={submitAnnouncement}>
          <label style={t.label}>Title</label>
          <input style={t.input} value={form.title} onChange={handleChange('title')} placeholder="Announcement title" required />
          <label style={t.label}>Message</label>
          <textarea style={t.textarea} value={form.content} onChange={handleChange('content')} placeholder="Write your announcement here..." required />
          <button style={t.btnFull} type="submit">Send Announcement to All Users</button>
        </form>
      </div>

      {/* Announcements list */}
      <div style={t.cardLg}>
        <div style={{ ...t.sectionTitle, marginBottom: '16px' }}>Previous Announcements</div>
        {loading && <div style={t.empty}>Loading…</div>}
        {!loading && announcements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4b7280' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📢</div>
            <div style={{ fontSize: '14px' }}>No announcements yet. Send your first one above.</div>
          </div>
        )}
        {announcements.map(a => (
          <div key={a.id} style={{ ...t.accentCard, marginBottom: '12px', borderLeft: '4px solid #818cf8' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#164E63', marginBottom: '6px' }}>{a.title}</div>
              <div style={{ fontSize: '13px', color: '#4b7280', marginBottom: '8px', lineHeight: '1.6' }}>{a.content}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {formatDate(a.createdAt)} · Sent by {a.createdBy}
              </div>
            </div>
            <button
              style={t.btnSmDanger}
              onClick={() => deleteAnnouncement(a.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
