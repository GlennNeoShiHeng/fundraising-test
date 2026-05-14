// Story #24 (FR-07) - Delete or Cancel Fundraising Activity (Fund Raiser)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

const statusBadge = (status) =>
  status === 'active' ? t.badge.active
  : status === 'completed' ? t.badge.completed
  : status === 'cancelled' ? t.badge.cancelled
  : t.badge.inactive

export default function ManageActivityPage() {
  const { token } = useAuth()
  const [activities, setActivities] = useState([])
  const [modal, setModal] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadActivities = async () => {
    const res2 = await fetch(`${API}/metrics`, { headers: { Authorization: `Bearer ${token}` } })
    const all = await res2.json()
    setActivities(Array.isArray(all) ? all : [])
    setLoading(false)
  }

  useEffect(() => { if (token) loadActivities() }, [token])

  const selectActivity = (type, activity) => {
    setSuccess(''); setError('')
    setModal({ type, activity })
  }

  const clickDeleteActivity = (activity) => selectActivity('delete', activity)
  const clickCancelActivity = (activity) => selectActivity('cancel', activity)

  const showConfirmationMessage = async () => {
    const { type, activity } = modal
    setModal(null)

    const url = type === 'delete'
      ? `${API}/manage-activity/${activity.id}`
      : `${API}/manage-activity/${activity.id}/cancel`

    const res = await fetch(url, {
      method: type === 'delete' ? 'DELETE' : 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()

    if (!res.ok) return showErrorMessages(data.error || 'Action failed')
    setSuccess(type === 'delete' ? `"${activity.title}" has been deleted.` : `"${activity.title}" has been cancelled.`)
    loadActivities()
  }

  const showErrorMessages = (msg) => setError(msg)

  if (loading) return <div style={t.empty}>Loading…</div>

  return (
    <div style={t.page('900px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>FUND RAISER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Manage Activities</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Delete or cancel your fundraising campaigns.</p>
      </div>

      {success && (
        <div style={{ ...t.alertSuccess, marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}
      {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}

      {activities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No activities found</div>
          <div style={{ fontSize: '14px' }}>Create a campaign to manage it here.</div>
        </div>
      )}

      {activities.map(a => (
        <div key={a.id} style={{ ...t.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#164E63', marginBottom: '6px' }}>{a.title}</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={statusBadge(a.status)}>{a.status}</span>
              <span style={t.badge.indigo}>{a.category}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#4b7280' }}>
              ${parseFloat(a.current_amount).toFixed(2)} raised of ${parseFloat(a.goal_amount).toFixed(2)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {a.status !== 'cancelled' && a.status !== 'completed' && (
              <button
                style={t.btnSmWarn}
                onClick={() => clickCancelActivity(a)}
                onMouseEnter={e => { e.currentTarget.style.background = '#fde68a' }}
                onMouseLeave={e => { e.currentTarget.style.background = t.btnSmWarn.background }}
              >
                Cancel
              </button>
            )}
            <button
              style={t.btnSmDanger}
              onClick={() => clickDeleteActivity(a)}
              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2' }}
              onMouseLeave={e => { e.currentTarget.style.background = t.btnSmDanger.background }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {modal && (
        <div style={t.overlay}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(7,34,61,0.25)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>
              {modal.type === 'delete' ? '🗑️' : '⏸️'}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#164E63' }}>
              {modal.type === 'delete' ? 'Delete Activity?' : 'Cancel Activity?'}
            </div>
            <div style={{ color: '#4b7280', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
              {modal.type === 'delete'
                ? `"${modal.activity.title}" will be permanently deleted and cannot be recovered.`
                : `"${modal.activity.title}" will be marked as cancelled. Donors will no longer be able to contribute.`}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button style={t.btnGhost} onClick={() => setModal(null)}>Go Back</button>
              <button
                style={modal.type === 'delete' ? t.btnDanger : { ...t.btn, background: '#d97706' }}
                onClick={showConfirmationMessage}
              >
                {modal.type === 'delete' ? 'Yes, Delete' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
