// Story #20 (FR04) - View Completed Fundraising Activity History (Fund Raiser)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function CompletedActivitiesPage() {
  const { token } = useAuth()
  const [history, setHistory] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`${API}/search/categories`).then(r => r.json()).then(setCategories).catch(() => {})
    if (token) searchCompletedFRAs()
  }, [token])

  const searchCompletedFRAs = async () => {
    setError('')
    const params = new URLSearchParams()
    if (categoryId) params.append('category_id', categoryId)
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const res = await fetch(`${API}/history/completed?${params}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed to load history')
    setHistory(Array.isArray(data) ? data : [])
    setLoaded(true)
  }

  const handleClear = () => { setCategoryId(''); setStartDate(''); setEndDate(''); setHistory([]); setLoaded(false) }

  const totalRaised = history.reduce((sum, a) => sum + parseFloat(a.current_amount || 0), 0)

  return (
    <div style={t.page('900px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(16,185,129,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(16,185,129,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>FUND RAISER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Completed Campaign History</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>View all your past fundraising campaigns that have been completed.</p>

        {history.length > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#10b981', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{history.length}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Completed Campaigns</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#22d3ee', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>${totalRaised.toLocaleString()}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Raised</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ ...t.filters, marginBottom: '24px' }}>
        <select style={t.filterEl} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Start</label>
          <input style={{ ...t.filterEl, flex: 'none' }} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>End</label>
          <input style={{ ...t.filterEl, flex: 'none' }} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button style={t.btn} onClick={searchCompletedFRAs}>Search</button>
        <button style={t.btnGhost} onClick={handleClear}>Clear</button>
      </div>

      {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}

      {loaded && history.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏁</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No completed campaigns yet</div>
          <div style={{ fontSize: '14px' }}>Completed campaigns will appear here once they reach their goal.</div>
        </div>
      )}

      {history.map(a => (
        <div key={a.id} style={{ ...t.card, marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#164E63', flex: 1 }}>{a.title}</div>
            <span style={t.badge.completed}>Completed</span>
          </div>
          <div style={{ ...t.badge.indigo, marginBottom: '10px' }}>{a.category}</div>
          <div style={{ background: '#e0f2fe', borderRadius: '99px', height: '8px', margin: '8px 0', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #10b981, #059669)', width: `${Math.min(a.progress, 100)}%` }} />
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#4b7280', flexWrap: 'wrap', marginTop: '4px' }}>
            <span><strong style={{ color: '#164E63' }}>${parseFloat(a.current_amount).toFixed(2)}</strong> raised</span>
            <span>Goal: ${parseFloat(a.goal_amount).toFixed(2)}</span>
            <span style={{ color: '#059669', fontWeight: '600' }}>{a.progress}% funded</span>
            <span>Started: {new Date(a.createdAt).toLocaleDateString()}</span>
            <span>Completed: {new Date(a.completedAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
