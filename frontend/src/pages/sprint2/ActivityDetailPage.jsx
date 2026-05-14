// Story #7 (DO04) - View Fundraising Activity Details and Progress (Donee)
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

const CATEGORY_COLORS = {
  Medical: 'linear-gradient(135deg, #0e7490, #0891B2)',
  Education: 'linear-gradient(135deg, #c2410c, #F97316)',
  Environment: 'linear-gradient(135deg, #15803d, #16a34a)',
  Community: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
  'Disaster Relief': 'linear-gradient(135deg, #b91c1c, #dc2626)',
}

export default function ActivityDetailPage() {
  const { id } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveError, setSaveError] = useState('')

  const requestActivityDetails = async () => {
    const res = await fetch(`${API}/activity-details/${id}`)
    if (!res.ok) return
    const data = await res.json()
    setActivity(data)
  }

  useEffect(() => { requestActivityDetails() }, [id])

  const saveToFavourites = async () => {
    setSaveMsg(''); setSaveError('')
    const res = await fetch(`${API}/favourites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ activity_id: id })
    })
    const data = await res.json()
    if (res.ok) setSaveMsg('Saved to favourites!')
    else setSaveError(data.error || 'Could not save')
  }

  if (!activity) return <div style={t.empty}>Loading activity…</div>

  const catGradient = CATEGORY_COLORS[activity.category] || 'linear-gradient(135deg, #0e7490, #0891B2)'
  const pct = activity.progress

  return (
    <div style={t.page('700px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <button
          style={{ ...t.backBtn, color: '#94a3b8', marginBottom: '16px', position: 'relative' }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <span style={{ ...t.badge.indigo, position: 'relative', marginBottom: '10px', display: 'inline-block' }}>{activity.category}</span>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '8px', position: 'relative', lineHeight: '1.3' }}>
          {activity.title}
        </h1>
        <span style={{ ...(activity.status === 'active' ? t.badge.active : t.badge.inactive), position: 'relative' }}>
          {activity.status}
        </span>
      </div>

      {/* Campaign image header */}
      <div style={{ background: catGradient, borderRadius: '16px', height: '120px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '40px', marginBottom: '4px' }}>❤️</div>
          <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.8 }}>{activity.category} Campaign</div>
        </div>
      </div>

      {/* Progress card */}
      <div style={{ ...t.card, marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Raised', value: `$${parseFloat(activity.current_amount).toFixed(2)}`, color: '#F97316' },
            { label: 'Goal', value: `$${parseFloat(activity.goal_amount).toFixed(2)}`, color: '#164E63' },
            { label: 'Progress', value: `${activity.progress}%`, color: '#0891B2' },
            { label: 'Fund Raiser', value: activity.fund_raiser, color: '#164E63' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #e0f2fe' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: '700', color }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={t.progressBg}>
          <div style={{ height: '100%', borderRadius: '99px', ...t.progressFill(pct) }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4b7280', marginTop: '4px' }}>
          <span style={{ fontWeight: '600', color: '#0891B2' }}>{pct}% funded</span>
          {pct >= 100 && <span style={{ color: '#059669', fontWeight: '700' }}>🎉 Goal Reached!</span>}
        </div>
      </div>

      {/* Description card */}
      <div style={{ ...t.card, marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', fontWeight: '700', color: '#164E63', marginBottom: '12px' }}>About this Campaign</div>
        <div style={{ fontSize: '15px', color: '#4b7280', lineHeight: '1.8' }}>{activity.description}</div>
      </div>

      {user?.role === 'donee' && (
        <div>
          <button
            style={t.btnFull}
            onClick={saveToFavourites}
            onMouseEnter={e => { e.currentTarget.style.background = '#ea6c0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = t.btnFull.background }}
          >
            Save to Favourites
          </button>
          {saveMsg && <div style={{ ...t.alertSuccess, marginTop: '12px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{saveMsg}</div>}
          {saveError && <div style={{ ...t.alertError, marginTop: '12px' }}>{saveError}</div>}
        </div>
      )}
    </div>
  )
}
