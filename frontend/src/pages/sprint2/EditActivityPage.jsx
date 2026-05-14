// Story #23 (FR02) - Edit Fundraising Activity Details (Fund Raiser)
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function EditActivityPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', description: '', goal_amount: '', category_id: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/search/categories`).then(r => r.json()).then(setCategories).catch(() => {})
    displayEditForm()
  }, [id, token])

  const displayEditForm = async () => {
    const res = await fetch(`${API}/edit-activity/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) { setError('Activity not found or access denied.'); setLoading(false); return }
    const data = await res.json()
    setForm({ title: data.title, description: data.description, goal_amount: data.goal_amount, category_id: data.category_id || '' })
    setLoading(false)
  }

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const submitEditForm = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const res = await fetch(`${API}/edit-activity/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, goal_amount: parseFloat(form.goal_amount) })
    })
    const data = await res.json()
    if (!res.ok) return showErrorMessages(data.error || 'Update failed')
    showSuccessMessage()
  }

  const showSuccessMessage = () => {
    setSuccess('Activity updated successfully!')
    setTimeout(() => navigate('/activity/ongoing'), 1800)
  }

  const showErrorMessages = (msg) => setError(msg)

  if (loading) return <div style={t.empty}>Loading…</div>

  return (
    <div style={t.page('640px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <button
          style={{ ...t.backBtn, color: '#94a3b8', marginBottom: '16px', position: 'relative' }}
          onClick={() => navigate(-1)}
        >
          ← Back to Campaigns
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>FUND RAISER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Edit Campaign</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Update your campaign details below.</p>
      </div>

      {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}
      {success && (
        <div style={{ ...t.alertSuccess, marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}

      <form style={t.cardLg} onSubmit={submitEditForm}>
        <label style={t.label}>Campaign Title</label>
        <input style={t.input} value={form.title} onChange={handleChange('title')} required />

        <label style={t.label}>Description</label>
        <textarea style={t.textarea} value={form.description} onChange={handleChange('description')} required />

        <label style={t.label}>Goal Amount ($)</label>
        <input style={t.input} type="number" min="1" step="0.01" value={form.goal_amount} onChange={handleChange('goal_amount')} required />

        <label style={t.label}>Category</label>
        <select style={t.select} value={form.category_id} onChange={handleChange('category_id')}>
          <option value="">No Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <button style={t.btnFull} type="submit">Save Changes</button>
      </form>
    </div>
  )
}
