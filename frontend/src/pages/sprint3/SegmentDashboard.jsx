// Story #22 (FR-22) - Identify and Segment Interested Users (Fund Raiser)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function SegmentDashboard() {
  const { token } = useAuth()
  const [activities, setActivities] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [segments, setSegments] = useState(null)
  const [activityInfo, setActivityInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)

  const displaySegmentDashboard = async () => {
    const res = await fetch(`${API}/segment/activities`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setActivities(Array.isArray(data) ? data : [])
    setLoadingList(false)
  }

  useEffect(() => { if (token) displaySegmentDashboard() }, [token])

  const selectActivity = async (e) => {
    const id = e.target.value
    setSelectedId(id)
    setSegments(null)
    setActivityInfo(null)
    if (!id) return
    setLoading(true)
    const res = await fetch(`${API}/segment/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (!res.ok) { setLoading(false); return }
    showSegments(data)
    setLoading(false)
  }

  const showSegments = (data) => {
    setActivityInfo(data.activity)
    setSegments(data.segments)
  }

  const SEGMENT_COLORS = {
    donors: { color: '#0891B2', bg: 'rgba(8,145,178,0.08)', label: 'Donors', desc: 'Users who have donated to this campaign' },
    favouriters: { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', label: 'Favouriters', desc: 'Users who shortlisted this campaign' },
    highlyInterested: { color: '#059669', bg: 'rgba(5,150,105,0.08)', label: 'Highly Interested', desc: 'Donated AND favourited this campaign' },
  }

  return (
    <div style={t.page('960px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(124,58,237,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>FUND RAISER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>User Segment Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Identify and segment users who are interested in your fundraising activities.</p>
      </div>

      {/* Activity selector */}
      <div style={{ ...t.cardLg, marginBottom: '24px', border: '2px solid #e0f2fe' }}>
        <label style={t.label}>Select a Fundraising Activity</label>
        {loadingList
          ? <div style={{ color: '#94a3b8', fontSize: '13px' }}>Loading activities...</div>
          : <select style={t.filterEl} value={selectedId} onChange={selectActivity}>
              <option value="">Choose an activity to view segments...</option>
              {activities.map(a => (
                <option key={a.id} value={a.id}>{a.title} ({a.status})</option>
              ))}
            </select>
        }
      </div>

      {!selectedId && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No activity selected</div>
          <div style={{ fontSize: '14px' }}>Select an activity above to view its interested user segments.</div>
        </div>
      )}

      {loading && (
        <div style={{ ...t.empty, paddingTop: '60px' }}>
          <div style={{ textAlign: 'center', color: '#4b7280' }}>Analysing user interest data...</div>
        </div>
      )}

      {!loading && activityInfo && (
        <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #ecfeff)', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '1px solid #a5f3fc', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '13px', color: '#4b7280' }}>Campaign: <strong style={{ color: '#164E63' }}>{activityInfo.title}</strong></div>
          <div style={{ fontSize: '13px', color: '#4b7280' }}>Category: <strong style={{ color: '#164E63' }}>{activityInfo.category}</strong></div>
          <div style={{ fontSize: '13px', color: '#4b7280' }}>Status: <span style={activityInfo.status === 'active' ? t.badge.active : t.badge.completed}>{activityInfo.status}</span></div>
          <div style={{ fontSize: '13px', color: '#4b7280' }}>Raised: <strong style={{ color: '#F97316' }}>${activityInfo.current_amount.toFixed(2)}</strong> / ${activityInfo.goal_amount.toFixed(2)}</div>
        </div>
      )}

      {!loading && segments && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {Object.entries(SEGMENT_COLORS).map(([key, { color, bg, label, desc }]) => {
            const seg = segments[key]
            if (!seg) return null
            return (
              <div key={key} style={{ ...t.card, padding: '0', overflow: 'hidden' }}>
                <div style={{ background: bg, borderBottom: `3px solid ${color}`, padding: '16px 20px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '800', color, fontFamily: "'Poppins', sans-serif" }}>{seg.count}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#164E63' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#4b7280', marginTop: '2px' }}>{desc}</div>
                </div>
                <div style={{ padding: '12px 20px' }}>
                  {seg.users.length === 0
                    ? <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>None yet</div>
                    : seg.users.map(u => (
                      <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f9ff' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#164E63' }}>{u.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{u.email}</div>
                        </div>
                        {u.totalGiven != null && (
                          <div style={{ fontSize: '12px', color: '#4b7280', textAlign: 'right' }}>
                            {u.donationCount} donation{u.donationCount !== 1 ? 's' : ''}<br />
                            <strong style={{ color: '#F97316' }}>${u.totalGiven.toFixed(2)}</strong>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
