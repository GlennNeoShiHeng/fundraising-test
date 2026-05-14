// Story #27 (DO03) - View Progress of Contributed Fundraising Activities (Donee)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function DonationHistoryPage() {
  const { token } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const loadContributedActivities = async () => {
    const res = await fetch(`${API}/contributions`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setActivities(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (token) loadContributedActivities() }, [token])

  const totalContributed = activities.reduce((sum, a) => sum + parseFloat(a.my_contribution || 0), 0)

  if (loading) return <div style={t.empty}>Loading…</div>

  return (
    <div style={t.page('860px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(249,115,22,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color: '#F97316' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span style={{ color: '#F97316', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>MY IMPACT</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>My Contributed Campaigns</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Track the progress of fundraisers you have supported.</p>

        {activities.length > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px', backdropFilter: 'blur(10px)' }}>
              <div style={{ color: '#22d3ee', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{activities.length}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Campaigns Supported</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px', backdropFilter: 'blur(10px)' }}>
              <div style={{ color: '#F97316', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>${totalContributed.toFixed(2)}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Donated</div>
            </div>
          </div>
        )}
      </div>

      {activities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💝</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No contributions yet</div>
          <div style={{ fontSize: '14px' }}>Browse campaigns and make your first donation to see your impact here.</div>
        </div>
      )}

      {activities.map(a => {
        const pct = a.progress
        const isActive = a.status === 'active'
        return (
          <div key={a.id} style={{ ...t.card, marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
              <div style={{ fontSize: '17px', fontWeight: '700', color: '#164E63', flex: 1 }}>{a.title}</div>
              <span style={isActive ? t.badge.active : t.badge.completed}>{a.status}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '10px', padding: '6px 14px', fontSize: '14px', fontWeight: '700', color: '#0891B2' }}>
                Your contribution: ${parseFloat(a.my_contribution).toFixed(2)}
              </div>
              <div style={{ ...t.badge.indigo, fontSize: '12px' }}>{a.category}</div>
            </div>

            <div style={t.progressBg}>
              <div style={{ height: '100%', borderRadius: '99px', ...t.progressFill(pct) }} />
            </div>

            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#4b7280', flexWrap: 'wrap', marginTop: '4px' }}>
              <span><strong style={{ color: '#164E63' }}>${parseFloat(a.current_amount).toFixed(2)}</strong> raised</span>
              <span>Goal: ${parseFloat(a.goal_amount).toFixed(2)}</span>
              <span style={{ color: '#0891B2', fontWeight: '600' }}>{pct}% funded</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
