// Story #3 (DO06) - Search and View Donation History (Donee)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function DonationSearchPage() {
  const { token } = useAuth()
  const [donations, setDonations] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`${API}/search/categories`).then(r => r.json()).then(setCategories).catch(() => {})
    if (token) clickSearch()
  }, [token])

  const enterCategory = (val) => setCategoryId(val)
  const enterDateRange = (type, val) => { if (type === 'start') setStartDate(val); else setEndDate(val) }

  const clickSearch = async () => {
    setError('')
    const params = new URLSearchParams()
    if (categoryId) params.append('category_id', categoryId)
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const res = await fetch(`${API}/donation-history?${params}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed to load donation history')
    setDonations(Array.isArray(data) ? data : [])
    setLoaded(true)
  }

  const handleClear = () => { setCategoryId(''); setStartDate(''); setEndDate(''); setDonations([]); setLoaded(false) }

  const totalDonated = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0)

  const displayDonationHistory = () => {
    if (!loaded) return null
    if (donations.length === 0) return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No donation records found</div>
        <div style={{ fontSize: '14px' }}>Try adjusting your filters or clear them to see all donations.</div>
      </div>
    )
    return donations.map(d => (
      <div
        key={d.id}
        style={{ ...t.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#164E63' }}>{d.activityTitle}</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={t.badge.indigo}>{d.category}</span>
            <span style={d.activityStatus === 'active' ? t.badge.active : t.badge.completed}>{d.activityStatus}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#4b7280' }}>
            {new Date(d.donatedAt).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '24px', fontWeight: '700', color: '#F97316' }}>
            ${parseFloat(d.amount).toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>donated</div>
        </div>
      </div>
    ))
  }

  return (
    <div style={t.page('900px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(249,115,22,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <span style={{ color: '#F97316', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>MY DONATIONS</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Donation History</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Search your individual donation records by category and date.</p>

        {loaded && donations.length > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#F97316', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{donations.length}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Donations</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#22d3ee', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>${totalDonated.toFixed(2)}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Given</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ ...t.filters, marginBottom: '24px' }}>
        <select style={t.filterEl} value={categoryId} onChange={e => enterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>From</label>
          <input style={{ ...t.filterEl, flex: 'none' }} type="date" value={startDate} onChange={e => enterDateRange('start', e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>To</label>
          <input style={{ ...t.filterEl, flex: 'none' }} type="date" value={endDate} onChange={e => enterDateRange('end', e.target.value)} />
        </div>
        <button style={t.btn} onClick={clickSearch}>Search</button>
        <button style={t.btnGhost} onClick={handleClear}>Clear</button>
      </div>

      {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}
      {displayDonationHistory()}
    </div>
  )
}
