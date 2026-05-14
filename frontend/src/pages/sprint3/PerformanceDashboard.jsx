// Story #19 (FR-02) - View Fund Raising Activities with Performance Metrics (Fund Raiser)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

const statusBadge = (status) =>
  status === 'active' ? t.badge.active
  : status === 'completed' ? t.badge.completed
  : t.badge.cancelled

export default function PerformanceDashboard() {
  const { token } = useAuth()
  const [activities, setActivities] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const displayDashboard = async () => {
    const res = await fetch(`${API}/metrics`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setActivities(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (token) displayDashboard() }, [token])

  const selectFRA = async (fraID) => {
    if (selected && selected.id === fraID) { setSelected(null); return }
    const res = await fetch(`${API}/metrics/${fraID}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setSelected(data)
  }

  const showMetrics = (metricsData) => (
    <div style={{ ...t.cardLg, marginTop: '8px', background: 'linear-gradient(135deg, #f0f9ff, #ecfeff)', border: '2px solid #a5f3fc' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: '700', color: '#164E63', marginBottom: '4px' }}>{metricsData.title}</div>
          <div style={{ fontSize: '13px', color: '#4b7280' }}>
            {metricsData.category} · Started {new Date(metricsData.createdAt).toLocaleDateString()}
          </div>
        </div>
        <button
          style={{ ...t.btnSmIndigo, fontSize: '12px' }}
          onClick={() => setSelected(null)}
        >
          Close ✕
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px', marginTop: '4px' }}>
        {[
          { val: `$${metricsData.totalDonations.toLocaleString()}`, label: 'Total Donations', color: '#F97316' },
          { val: metricsData.donorCount, label: 'Unique Donors', color: '#0891B2' },
          { val: metricsData.shortListCount, label: 'Shortlisted', color: '#7c3aed' },
          { val: `${metricsData.engagementRate}%`, label: 'Engagement Rate', color: '#0891B2' },
          { val: `${metricsData.progress}%`, label: 'Goal Progress', color: '#059669' },
          { val: `$${parseFloat(metricsData.goal_amount).toLocaleString()}`, label: 'Goal Amount', color: '#164E63' },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e0f2fe', boxShadow: '0 1px 4px rgba(8,145,178,0.07)' }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '22px', fontWeight: '700', color }}>{val}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) return <div style={t.empty}>Loading…</div>

  return (
    <div style={t.page('960px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>FUND RAISER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Performance Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Click a campaign to view its detailed performance metrics.</p>

        {activities.length > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#22d3ee', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{activities.length}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Campaigns</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#10b981', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>
                {activities.filter(a => a.status === 'active').length}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Active Now</div>
            </div>
          </div>
        )}
      </div>

      {activities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No activities yet</div>
          <div style={{ fontSize: '14px' }}>Create your first campaign to start tracking performance.</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {activities.map(a => {
          const isSelected = selected && selected.id === a.id
          return (
            <div
              key={a.id}
              style={{
                ...t.card,
                cursor: 'pointer',
                border: `2px solid ${isSelected ? '#0891B2' : '#e0f2fe'}`,
                boxShadow: isSelected ? '0 6px 20px rgba(8,145,178,0.18)' : '0 1px 4px rgba(8,145,178,0.07)',
                transition: 'all 0.2s',
              }}
              onClick={() => selectFRA(a.id)}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 6px 20px rgba(8,145,178,0.1)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 1px 4px rgba(8,145,178,0.07)' }}
            >
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#164E63', marginBottom: '6px' }}>{a.title}</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={statusBadge(a.status)}>{a.status}</span>
              </div>
              <div style={{ ...t.progressBgSm, margin: '0 0 8px' }}>
                <div style={{ height: '100%', borderRadius: '99px', ...t.progressFill(a.progress) }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: '#4b7280' }}>
                <span style={{ color: '#F97316', fontWeight: '600' }}>${parseFloat(a.current_amount).toLocaleString()}</span>
                <span>{a.donorCount} donors</span>
                <span>{a.shortListCount} shortlisted</span>
              </div>
            </div>
          )
        })}
      </div>

      {selected && showMetrics(selected)}
    </div>
  )
}
