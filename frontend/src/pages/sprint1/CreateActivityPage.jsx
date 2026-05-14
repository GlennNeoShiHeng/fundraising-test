import { useState, useEffect } from 'react'
import api from '../../services/api'
import { t } from '../../theme'

export default function CreateActivityPage() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', description: '', goalAmount: '', categoryId: '' })
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const displayCreateForm = () => {
    api.get('/activities/categories').then(r => {
      setCategories(r.data.categories)
      if (r.data.categories.length > 0) {
        setForm(prev => ({ ...prev, categoryId: r.data.categories[0].id }))
      }
    })
  }
  useEffect(() => { displayCreateForm() }, [])

  const submitCreateForm = async (e) => {
    e.preventDefault()
    setSuccess(''); setErrors([]); setLoading(true)
    try {
      await api.post('/activities', form)
      showSuccessMessage()
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Failed to create activity. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  const showSuccessMessage = () => {
    setSuccess('Fundraising activity created successfully!')
    setForm({ title: '', description: '', goalAmount: '', categoryId: categories[0]?.id || '' })
  }

  return (
    <div style={t.page('680px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>FUND RAISER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Create Fundraising Activity</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Set up a new campaign to start raising funds for your cause.</p>
      </div>

      <div style={{ ...t.cardLg, padding: '28px 32px' }}>
        {success && (
          <div style={{ ...t.alertSuccess, marginBottom: '20px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}
        {errors.length > 0 && (
          <div style={{ ...t.alertError, marginBottom: '20px' }}>
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <form onSubmit={submitCreateForm}>
          <label style={t.label}>Activity Title</label>
          <input style={t.input} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Help Build a School in Rural Cambodia" required />

          <label style={t.label}>Description</label>
          <textarea style={t.textarea} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your fundraising cause in detail. Tell donors why this campaign matters, who it will help, and how the funds will be used." required />

          <label style={t.label}>Goal Amount (USD)</label>
          <input style={t.input} type="number" min="1" step="0.01" value={form.goalAmount}
            onChange={e => setForm({ ...form, goalAmount: e.target.value })}
            placeholder="e.g. 10000" required />

          <label style={t.label}>Category</label>
          <select style={t.select} value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <button
            style={{ ...t.btnFull, opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Launch Campaign'}
          </button>
        </form>
      </div>
    </div>
  )
}
