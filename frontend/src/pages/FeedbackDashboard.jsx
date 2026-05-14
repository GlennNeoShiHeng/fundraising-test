import { useState, useEffect } from 'react'
import api from '../services/api'
import { t } from '../theme'

const typeBadge = (type) => type === 'issue'
  ? { background: '#fef2f2', color: '#dc2626', borderRadius: '99px', padding: '2px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' }
  : { background: '#ecfeff', color: '#0891B2', borderRadius: '99px', padding: '2px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' }

const statusBadge = (status) =>
  status === 'pending' ? t.badge.pending
  : status === 'reviewed' ? t.badge.indigo
  : t.badge.completed

export default function FeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState([])
  const [trends, setTrends] = useState([])
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const params = {}
    if (typeFilter) params.type = typeFilter
    if (statusFilter) params.status = statusFilter
    const res = await api.get('/feedback/trends', { params })
    setFeedbacks(res.data.feedbacks)
    setTrends(res.data.trends)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const issueCount = feedbacks.filter(f => f.feedback_type === 'issue').length
  const suggestionCount = feedbacks.filter(f => f.feedback_type === 'suggestion').length
  const pendingCount = feedbacks.filter(f => f.status === 'pending').length

  return (
    <div style={t.page('960px')}>
      {/* Admin Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(8,145,178,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>PLATFORM MANAGER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Feedback Trends</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Identify recurring issues and track user feedback patterns.</p>

        {feedbacks.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', position: 'relative', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#818cf8', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{feedbacks.length}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Feedback</div>
            </div>
            <div style={{ background: 'rgba(220,38,38,0.15)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#f87171', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{issueCount}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Issues Reported</div>
            </div>
            <div style={{ background: 'rgba(8,145,178,0.15)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#22d3ee', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{suggestionCount}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Suggestions</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.15)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#fbbf24', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{pendingCount}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Pending Review</div>
            </div>
          </div>
        )}
      </div>

      {/* Trend cards */}
      {trends.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          {trends.map(tr => (
            <div key={tr.id} style={{ ...t.card, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '36px', fontWeight: '700', color: tr.issue_type === 'issue' ? '#dc2626' : '#0891B2' }}>
                {tr.frequency}
              </div>
              <div style={{ color: '#4b7280', fontSize: '14px', marginTop: '4px' }}>
                {tr.issue_type === 'issue' ? 'Issues Reported' : 'Suggestions Made'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ ...t.filters, marginBottom: '24px' }}>
        <select style={t.filterEl} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="issue">Issues</option>
          <option value="suggestion">Suggestions</option>
        </select>
        <select style={t.filterEl} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
        <button style={t.btn} onClick={load}>Filter</button>
      </div>

      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: '700', color: '#164E63', marginBottom: '16px' }}>
        All Feedback ({feedbacks.length})
      </div>

      {loading && <div style={t.empty}>Loading…</div>}
      {!loading && feedbacks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#164E63', marginBottom: '8px' }}>No feedback found</div>
          <div style={{ fontSize: '14px' }}>Try adjusting your filters to see more results.</div>
        </div>
      )}

      {feedbacks.map(f => (
        <div key={f.id} style={{ ...t.cardList, marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={typeBadge(f.feedback_type)}>{f.feedback_type}</span>
            <span style={statusBadge(f.status)}>{f.status}</span>
          </div>
          <div style={{ fontSize: '14px', color: '#164E63', lineHeight: '1.7' }}>{f.message}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Submitted {new Date(f.submitted_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      ))}
    </div>
  )
}
