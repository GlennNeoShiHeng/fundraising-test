// Story #12 (DO02) - Search Fundraising Activities (Donee)
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [searched, setSearched] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/search/categories`).then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  const search = async () => {
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    if (categoryId) params.append('category_id', categoryId)
    if (date) params.append('date', date)
    const res = await fetch(`${API}/search?${params}`)
    const data = await res.json()
    setResults(Array.isArray(data) ? data : [])
    setSearched(true)
  }

  const handleClear = () => { setKeyword(''); setCategoryId(''); setDate(''); setResults([]); setSearched(false) }

  const displayResults = () => {
    if (!searched) return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>Discover campaigns that matter</div>
        <div style={{ fontSize: '14px' }}>Search by keyword, category, or date to find causes you care about.</div>
      </div>
    )
    if (results.length === 0) return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😔</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No campaigns found</div>
        <div style={{ fontSize: '14px' }}>Try different keywords or browse all categories.</div>
      </div>
    )
    return (
      <div>
        <div style={{ fontSize: '13px', color: '#4b7280', marginBottom: '16px', fontWeight: '600' }}>
          {results.length} campaign{results.length !== 1 ? 's' : ''} found
        </div>
        {results.map(a => {
          const pct = a.progress
          return (
            <div
              key={a.id}
              style={{ background: '#fff', border: '1px solid #e0f2fe', borderRadius: '16px', padding: '20px', marginBottom: '14px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(8,145,178,0.07)', transition: 'all 0.2s' }}
              onClick={() => navigate(`/activity/${a.id}`)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(8,145,178,0.12)'; e.currentTarget.style.borderColor = '#a5f3fc' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(8,145,178,0.07)'; e.currentTarget.style.borderColor = '#e0f2fe' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px' }}>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#164E63', flex: 1 }}>{a.title}</div>
                <span style={{ ...t.badge.indigo, whiteSpace: 'nowrap', flexShrink: 0 }}>{a.category}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#4b7280', marginBottom: '12px', lineHeight: '1.6' }}>
                {a.description.substring(0, 140)}{a.description.length > 140 ? '…' : ''}
              </div>
              <div style={{ ...t.progressBgSm, margin: '8px 0' }}>
                <div style={{ height: '100%', borderRadius: '99px', ...t.progressFill(pct) }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#4b7280', flexWrap: 'wrap', marginTop: '8px' }}>
                <span><strong style={{ color: '#164E63' }}>${parseFloat(a.current_amount).toFixed(2)}</strong> raised</span>
                <span>Goal: ${parseFloat(a.goal_amount).toFixed(2)}</span>
                <span style={{ color: '#0891B2', fontWeight: '600' }}>{pct}% funded</span>
                <span style={{ marginLeft: 'auto', color: '#0891B2', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View campaign →
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={t.page('900px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>DISCOVER CAMPAIGNS</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Search Campaigns</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Find causes that align with your values and start making an impact.</p>
      </div>

      <div style={{ ...t.filters, marginBottom: '28px' }}>
        <input
          style={{ ...t.filterEl, flex: '2' }}
          placeholder="Search by keyword…"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <select style={t.filterEl} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          style={t.filterEl}
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          title="Show campaigns created on or after this date"
        />
        <button style={t.btn} onClick={search}>Search</button>
        <button style={t.btnGhost} onClick={handleClear}>Clear</button>
      </div>

      {displayResults()}
    </div>
  )
}
