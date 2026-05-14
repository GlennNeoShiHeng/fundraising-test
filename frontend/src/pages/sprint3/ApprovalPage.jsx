// Story #34 (PA06) - Approve or Reject Fundraising Activities (Platform Manager)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

const approvalBadge = (status) =>
  status === 'pending' ? t.badge.pending
  : status === 'approved' ? t.badge.approved
  : status === 'rejected' ? t.badge.rejected
  : t.badge.inactive

export default function ApprovalPage() {
  const { token } = useAuth()
  const [activities, setActivities] = useState([])
  const [tab, setTab] = useState('pending')
  const [reasons, setReasons] = useState({})
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const displayPendingActivities = async (mode) => {
    setLoading(true)
    const endpoint = mode === 'pending' ? '/approval/pending' : '/approval/all'
    const res = await fetch(`${API}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setActivities(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (token) displayPendingActivities(tab) }, [token, tab])

  const selectTab = (newTab) => { setTab(newTab); setSuccess(''); setError('') }

  const approveActivity = async (id, title) => {
    setError(''); setSuccess('')
    const res = await fetch(`${API}/approval/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) return showErrorMessage(data.error || 'Failed to approve')
    showDecisionResult(`"${title}" has been approved.`)
    displayPendingActivities(tab)
  }

  const rejectActivity = async (id, title) => {
    const reason = reasons[id] || ''
    if (!reason.trim()) return showErrorMessage('Please enter a rejection reason before rejecting.')
    setError(''); setSuccess('')
    const res = await fetch(`${API}/approval/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason })
    })
    const data = await res.json()
    if (!res.ok) return showErrorMessage(data.error || 'Failed to reject')
    showDecisionResult(`"${title}" has been rejected.`)
    setReasons(prev => { const n = { ...prev }; delete n[id]; return n })
    displayPendingActivities(tab)
  }

  const showDecisionResult = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const showErrorMessage = (msg) => setError(msg)

  const formatDate = (d) => new Date(d).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })

  const pendingCount = tab === 'all' ? activities.filter(a => a.approval_status === 'pending').length : activities.length

  return (
    <div style={t.page('900px')}>
      {/* Admin Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(8,145,178,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>PLATFORM MANAGER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Activity Approval</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Review and approve or reject newly submitted fundraising activities.</p>

        {pendingCount > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
            <div style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#fbbf24', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{pendingCount}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Pending Review</div>
            </div>
          </div>
        )}
      </div>

      {success && (
        <div style={{ ...t.alertSuccess, marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}
      {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#e0f2fe', padding: '4px', borderRadius: '10px' }}>
        {[['pending', 'Pending Review'], ['all', 'All Activities']].map(([val, label]) => (
          <button
            key={val}
            style={{
              flex: 1, padding: '9px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '13px',
              background: tab === val ? '#0891B2' : 'transparent',
              color: tab === val ? '#fff' : '#0e7490',
              transition: 'all 0.2s',
            }}
            onClick={() => selectTab(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <div style={t.empty}>Loading…</div>}
      {!loading && activities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>
            {tab === 'pending' ? 'All caught up!' : 'No activities found.'}
          </div>
          <div style={{ fontSize: '14px' }}>
            {tab === 'pending' ? 'No activities pending review at this time.' : ''}
          </div>
        </div>
      )}

      {activities.map(a => (
        <div key={a.id} style={{ ...t.card, marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#164E63', marginBottom: '6px' }}>{a.title}</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={approvalBadge(a.approval_status)}>{a.approval_status}</span>
                <span style={t.badge.indigo}>{a.category}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4b7280', marginBottom: '8px' }}>
                By <strong>{a.fund_raiser}</strong> · Goal: ${parseFloat(a.goal_amount).toFixed(2)} · Submitted {formatDate(a.createdAt)}
              </div>
              <div style={{ fontSize: '13px', color: '#4b7280', lineHeight: '1.6', marginBottom: '8px' }}>
                {a.description.substring(0, 160)}{a.description.length > 160 ? '…' : ''}
              </div>
              {a.approval_status === 'rejected' && a.rejection_reason && (
                <div style={{ fontSize: '12px', color: '#dc2626', fontStyle: 'italic', background: '#fef2f2', borderRadius: '6px', padding: '6px 10px' }}>
                  Rejection reason: {a.rejection_reason}
                </div>
              )}
            </div>

            {a.approval_status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
                <input
                  style={{ width: '200px', padding: '8px 12px', border: '1.5px solid #a5f3fc', borderRadius: '8px', fontSize: '13px', color: '#164E63', outline: 'none' }}
                  placeholder="Rejection reason..."
                  value={reasons[a.id] || ''}
                  onChange={(e) => setReasons(prev => ({ ...prev, [a.id]: e.target.value }))}
                />
                <button
                  style={t.btnSmSuccess}
                  onClick={() => approveActivity(a.id, a.title)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#bbf7d0' }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.btnSmSuccess.background }}
                >
                  Approve
                </button>
                <button
                  style={t.btnSmDanger}
                  onClick={() => rejectActivity(a.id, a.title)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2' }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.btnSmDanger.background }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
