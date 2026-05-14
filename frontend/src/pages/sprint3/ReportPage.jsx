// Story #38 (PM-06) - Generate Fundraising Reports (Platform Manager)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function ReportPage() {
  const { token } = useAuth()
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/search/categories`).then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  const selectFilters = (type, val) => {
    if (type === 'category') setCategoryId(val)
    else setTimePeriod(val)
  }

  const requestReportGeneration = async () => {
    setError('')
    const params = new URLSearchParams()
    if (categoryId) params.append('category_id', categoryId)
    if (timePeriod) params.append('timePeriod', timePeriod)

    const res = await fetch(`${API}/reports?${params}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed to generate report')
    setReport(data)
  }

  const displayReport = () => {
    if (!report) return null
    const { summary, breakdown, generatedAt } = report

    return (
      <div>
        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { val: summary.totalCampaigns, label: 'Total Campaigns', color: '#818cf8' },
            { val: `$${summary.totalRaised.toLocaleString()}`, label: 'Total Raised', color: '#0891B2' },
            { val: `$${summary.totalGoal.toLocaleString()}`, label: 'Total Goal', color: '#164E63' },
            { val: `${summary.overallAchievementRate}%`, label: 'Achievement Rate', color: '#059669' },
          ].map(({ val, label, color }) => (
            <div key={label} style={{ ...t.card, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '700', color }}>{val}</div>
              <div style={{ fontSize: '13px', color: '#4b7280', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {breakdown.length === 0
          ? <div style={t.empty}>No campaigns match the selected filters.</div>
          : (
            <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e0f2fe', boxShadow: '0 1px 4px rgba(8,145,178,0.07)' }}>
              <table style={t.table}>
                <thead>
                  <tr style={{ background: '#f0f9ff' }}>
                    {['Category', 'Campaigns', 'Active', 'Completed', 'Total Raised', 'Goal', 'Achievement'].map(h => (
                      <th key={h} style={t.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((row, i) => (
                    <tr
                      key={i}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <td style={t.td}><strong style={{ color: '#0891B2' }}>{row.category}</strong></td>
                      <td style={t.td}>{row.totalCampaigns}</td>
                      <td style={t.td}><span style={t.badge.active}>{row.activeCampaigns}</span></td>
                      <td style={t.td}><span style={t.badge.completed}>{row.completedCampaigns}</span></td>
                      <td style={{ ...t.td, color: '#F97316', fontWeight: '600' }}>${row.totalRaised.toLocaleString()}</td>
                      <td style={t.td}>${row.totalGoal.toLocaleString()}</td>
                      <td style={{ ...t.td, minWidth: '120px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0891B2', marginBottom: '4px' }}>{row.achievementRate}%</div>
                        <div style={{ background: '#e0f2fe', borderRadius: '99px', height: '6px' }}>
                          <div style={{ background: 'linear-gradient(90deg, #22d3ee, #0891B2)', height: '6px', borderRadius: '99px', width: `${Math.min(row.achievementRate, 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px', textAlign: 'right' }}>
          Report generated: {new Date(generatedAt).toLocaleString()}
        </div>
      </div>
    )
  }

  return (
    <div style={t.page('960px')}>
      {/* Admin Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(8,145,178,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>PLATFORM MANAGER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Fundraising Reports</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Generate platform performance reports by category and time period.</p>
      </div>

      <div style={{ ...t.filters, marginBottom: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Category</label>
          <select style={t.filterEl} value={categoryId} onChange={e => selectFilters('category', e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Time Period</label>
          <select style={t.filterEl} value={timePeriod} onChange={e => selectFilters('period', e.target.value)}>
            <option value="">All Time</option>
            <option value="1m">Last 1 Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>
        <button style={t.btn} onClick={requestReportGeneration}>Generate Report</button>
      </div>

      {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}
      {displayReport()}
    </div>
  )
}
