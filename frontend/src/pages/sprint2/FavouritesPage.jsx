// Story #8 (DO05) - Save Fundraising Campaign to Favourites (Donee)
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function FavouritesPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmMsg, setConfirmMsg] = useState('')

  const loadFavourites = async () => {
    const res = await fetch(`${API}/favourites`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setFavourites(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (token) loadFavourites() }, [token])

  const displaySaveConfirmation = (msg) => {
    setConfirmMsg(msg)
    setTimeout(() => setConfirmMsg(''), 3000)
  }

  const handleRemove = async (activity_id) => {
    const res = await fetch(`${API}/favourites/${activity_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setFavourites(prev => prev.filter(f => f.activity_id !== activity_id))
      displaySaveConfirmation('Removed from favourites.')
    }
  }

  if (loading) return <div style={t.empty}>Loading…</div>

  return (
    <div style={t.page('860px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(249,115,22,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#F97316" stroke="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span style={{ color: '#F97316', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>SAVED CAMPAIGNS</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>
          My Favourites
          {favourites.length > 0 && (
            <span style={{ marginLeft: '12px', background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '99px', padding: '2px 12px', fontSize: '14px', fontWeight: '600', color: '#F97316', verticalAlign: 'middle' }}>
              {favourites.length}
            </span>
          )}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Campaigns you've saved to support later.</p>
      </div>

      {confirmMsg && (
        <div style={{ ...t.alertSuccess, marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {confirmMsg}
        </div>
      )}

      {favourites.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤍</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No saved campaigns yet</div>
          <div style={{ fontSize: '14px' }}>Browse campaigns and save the ones you'd like to support later.</div>
        </div>
      )}

      {favourites.map(f => (
        <div
          key={f.favourite_id}
          style={{ ...t.card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}
        >
          <div
            style={{ flex: 1, cursor: 'pointer' }}
            onClick={() => navigate(`/activity/${f.activity_id}`)}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#164E63' }}>{f.title}</div>
              <span style={t.badge.indigo}>{f.category}</span>
            </div>
            <div style={{ ...t.progressBgSm, margin: '8px 0' }}>
              <div style={{ height: '100%', borderRadius: '99px', ...t.progressFill(f.progress) }} />
            </div>
            <div style={{ fontSize: '13px', color: '#4b7280', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>${parseFloat(f.current_amount).toFixed(2)} raised of ${parseFloat(f.goal_amount).toFixed(2)}</span>
              <span style={{ color: '#0891B2', fontWeight: '600' }}>{f.progress}% funded</span>
              <span style={{ color: '#0891B2', fontWeight: '600' }}>View →</span>
            </div>
          </div>
          <button
            style={t.btnSmDanger}
            onClick={() => handleRemove(f.activity_id)}
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2' }}
            onMouseLeave={e => { e.currentTarget.style.background = t.btnSmDanger.background }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
