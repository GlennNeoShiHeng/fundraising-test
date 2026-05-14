// Story #10 (DN-09) - Receive Recommended Fundraising Campaigns (Donee)
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function RecommendationsPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState([])
  const [basedOn, setBasedOn] = useState('')
  const [loading, setLoading] = useState(true)

  const showInterestSummary = async () => {
    const res = await fetch(`${API}/recommendations`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : [])
    setBasedOn(data.basedOn || '')
    setLoading(false)
  }

  useEffect(() => { if (token) showInterestSummary() }, [token])

  const viewCampaignDetails = (id) => navigate(`/activity/${id}`)

  if (loading) return (
    <div style={{ ...t.empty, paddingTop: '80px' }}>
      <div style={{ fontSize: '36px', marginBottom: '12px', textAlign: 'center' }}>✨</div>
      <div style={{ textAlign: 'center' }}>Finding campaigns for you…</div>
    </div>
  )

  return (
    <div style={t.page('900px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(249,115,22,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span style={{ color: '#F97316', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>JUST FOR YOU</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Recommended for You</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Campaigns selected based on your interests and donation history.</p>
      </div>

      {basedOn && (
        <div style={{ ...t.alertInfo, marginBottom: '24px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Recommendations based on {basedOn}
        </div>
      )}

      {recommendations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No recommendations yet</div>
          <div style={{ fontSize: '14px' }}>Browse and support campaigns to unlock personalised recommendations.</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '18px' }}>
        {recommendations.map(r => {
          const catGradient = CATEGORY_COLORS[r.category] || 'linear-gradient(135deg, #0e7490, #0891B2)'
          return (
            <div
              key={r.id}
              style={{ ...t.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', padding: '0', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
              onClick={() => viewCampaignDetails(r.id)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(8,145,178,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(8,145,178,0.07)' }}
            >
              {/* Category gradient header */}
              <div style={{ background: catGradient, height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>{r.category}</span>
              </div>

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#164E63', marginBottom: '6px', lineHeight: '1.4' }}>{r.title}</div>
                <div style={{ fontSize: '13px', color: '#4b7280', marginBottom: '12px', lineHeight: '1.6', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {r.description}
                </div>

                <div style={{ ...t.progressBgSm, margin: '0 0 6px' }}>
                  <div style={{ height: '100%', borderRadius: '99px', ...t.progressFill(r.progress) }} />
                </div>
                <div style={{ fontSize: '12px', color: '#4b7280', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>${parseFloat(r.current_amount).toFixed(2)} raised</span>
                  <span style={{ color: '#0891B2', fontWeight: '600' }}>{r.progress}%</span>
                </div>

                {r.reason && (
                  <div style={{ fontSize: '11px', color: '#F97316', fontStyle: 'italic', marginBottom: '12px', fontWeight: '600', background: 'rgba(249,115,22,0.08)', borderRadius: '6px', padding: '6px 10px' }}>
                    ✨ {r.reason}
                  </div>
                )}

                <button
                  style={{ ...t.btnFull, marginTop: 'auto' }}
                  onClick={(e) => { e.stopPropagation(); viewCampaignDetails(r.id) }}
                >
                  View Campaign
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
