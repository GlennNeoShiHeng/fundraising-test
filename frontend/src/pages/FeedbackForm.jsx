import { useState } from 'react'
import api from '../services/api'
import { t } from '../theme'

export default function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState('issue')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(''); setError(''); setLoading(true)
    try {
      await api.post('/feedback', { feedback_type: feedbackType, message })
      setSuccess('Your feedback has been submitted successfully! Thank you for helping us improve.')
      setMessage('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={t.page('600px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>YOUR VOICE MATTERS</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Submit Feedback</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Share an issue or suggestion to help us improve the platform.</p>
      </div>

      {/* Type selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { value: 'issue', label: 'Report an Issue', icon: '⚠️', desc: 'Something is broken or not working as expected' },
          { value: 'suggestion', label: 'Make a Suggestion', icon: '💡', desc: 'Share an idea to improve the platform' },
        ].map(opt => (
          <div
            key={opt.value}
            style={{
              flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
              border: `2px solid ${feedbackType === opt.value ? '#0891B2' : '#e0f2fe'}`,
              background: feedbackType === opt.value ? '#ecfeff' : '#fff',
              transition: 'all 0.15s',
            }}
            onClick={() => setFeedbackType(opt.value)}
          >
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{opt.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: feedbackType === opt.value ? '#0891B2' : '#164E63', marginBottom: '4px' }}>{opt.label}</div>
            <div style={{ fontSize: '12px', color: '#4b7280', lineHeight: '1.4' }}>{opt.desc}</div>
          </div>
        ))}
      </div>

      <div style={t.cardLg}>
        {success && (
          <div style={{ ...t.alertSuccess, marginBottom: '20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}
        {error && <div style={{ ...t.alertError, marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={t.label}>Your Message</label>
          <textarea
            style={{ ...t.textarea, minHeight: '160px' }}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={feedbackType === 'issue'
              ? 'Describe the issue in detail — what happened, what you expected, and any steps to reproduce it.'
              : 'Share your suggestion in detail — what would you like to see and how would it help?'
            }
            required
          />
          <button
            style={{ ...t.btnFull, opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}
