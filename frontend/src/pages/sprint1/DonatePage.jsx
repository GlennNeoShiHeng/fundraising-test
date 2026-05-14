import { useState, useEffect } from 'react'
import api from '../../services/api'
import { t } from '../../theme'

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer']

const CATEGORY_COLORS = {
  Medical: { bg: 'linear-gradient(135deg, #0e7490, #0891B2)', icon: '🏥' },
  Education: { bg: 'linear-gradient(135deg, #c2410c, #F97316)', icon: '📚' },
  Environment: { bg: 'linear-gradient(135deg, #15803d, #16a34a)', icon: '🌱' },
  Community: { bg: 'linear-gradient(135deg, #6d28d9, #7c3aed)', icon: '🤝' },
  'Disaster Relief': { bg: 'linear-gradient(135deg, #b91c1c, #dc2626)', icon: '🆘' },
}

const getCategoryStyle = (name) => CATEGORY_COLORS[name] || { bg: 'linear-gradient(135deg, #0e7490, #0891B2)', icon: '❤️' }

export default function DonatePage() {
  const [activities, setActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const displayActivityDetails = () => {
    api.get('/donations/activities').then(r => setActivities(r.data.activities))
  }
  useEffect(() => { displayActivityDetails() }, [])

  const submitDonation = async (e) => {
    e.preventDefault()
    if (!selectedActivity) return setError('Please select a fundraising activity first.')
    setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await api.post('/donations/donate', {
        activity_id: selectedActivity.id,
        amount: parseFloat(amount),
        payment_method: paymentMethod
      })
      showConfirmation(res.data.message, res.data.newTotal)
    } catch (err) {
      setError(err.response?.data?.error || 'Donation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const showConfirmation = (message, newTotal) => {
    setSuccess(message)
    setAmount('')
    setActivities(prev => prev.map(a =>
      a.id === selectedActivity.id ? { ...a, current_amount: newTotal } : a
    ))
    setSelectedActivity(prev => ({ ...prev, current_amount: newTotal }))
  }

  const getProgress = (activity) => {
    const goal = parseFloat(activity.goal_amount)
    const current = parseFloat(activity.current_amount)
    if (goal <= 0) return 0
    return Math.round((current / goal) * 100)
  }

  const QUICK_AMOUNTS = [10, 25, 50, 100]

  return (
    <div style={t.page('980px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(249,115,22,0.2)', borderRadius: '10px', padding: '8px 12px', fontSize: '20px' }}>❤️</div>
          <span style={{ color: '#F97316', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>MAKE A DIFFERENCE</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Donate to a Cause</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Select a campaign below and make a contribution that matters.</p>
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', fontStyle: 'italic' }}>Click a campaign to select it, then fill in your donation details below.</p>

      {activities.length === 0 ? (
        <div style={{ ...t.empty, paddingTop: '40px' }}>No active fundraising activities at the moment.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {activities.map(a => {
            const pct = getProgress(a)
            const isSelected = selectedActivity?.id === a.id
            const cat = getCategoryStyle(a.category?.name)
            return (
              <div
                key={a.id}
                style={{
                  background: '#fff',
                  border: `2px solid ${isSelected ? '#0891B2' : '#e0f2fe'}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 8px 24px rgba(8,145,178,0.18)' : '0 1px 4px rgba(8,145,178,0.07)',
                  transition: 'all 0.2s',
                }}
                onClick={() => { setSelectedActivity(a); setSuccess(''); setError('') }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 6px 20px rgba(8,145,178,0.12)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 1px 4px rgba(8,145,178,0.07)' }}
              >
                <div style={{ background: cat.bg, height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', position: 'relative' }}>
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#0891B2', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  {a.category && (
                    <span style={{ background: '#ecfeff', color: '#0891B2', borderRadius: '99px', padding: '2px 10px', fontSize: '11px', fontWeight: '600', display: 'inline-block', marginBottom: '8px' }}>
                      {a.category.name}
                    </span>
                  )}
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#164E63', marginBottom: '6px' }}>{a.title}</div>
                  <div style={{ fontSize: '12px', color: '#4b7280', marginBottom: '10px', lineHeight: '1.5' }}>
                    {a.description.substring(0, 80)}{a.description.length > 80 ? '…' : ''}
                  </div>
                  <div style={{ background: '#e0f2fe', borderRadius: '99px', height: '6px', marginBottom: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '99px', ...t.progressFill(pct) }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4b7280' }}>
                    <span style={{ fontWeight: '600', color: '#0891B2' }}>${parseFloat(a.current_amount).toLocaleString()} raised</span>
                    <span>{pct}% of ${parseFloat(a.goal_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Donation Panel */}
      <div style={{ ...t.cardLg, border: selectedActivity ? '2px solid #a5f3fc' : '2px solid #e0f2fe' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: '700', color: '#164E63', marginBottom: '4px' }}>
            {selectedActivity ? `Donating to: ${selectedActivity.title}` : 'Make a Donation'}
          </div>
          <div style={{ fontSize: '13px', color: '#4b7280' }}>
            {selectedActivity ? 'Enter your donation amount and payment details below.' : 'Select a campaign above to continue.'}
          </div>
        </div>

        {success && (
          <div style={{ ...t.alertSuccess, marginBottom: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}
        {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={submitDonation}>
          <label style={t.label}>Quick amounts</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {QUICK_AMOUNTS.map(q => (
              <button
                key={q} type="button"
                style={{
                  padding: '8px 18px', borderRadius: '8px', border: '1.5px solid',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  borderColor: parseFloat(amount) === q ? '#0891B2' : '#a5f3fc',
                  background: parseFloat(amount) === q ? '#ecfeff' : '#fff',
                  color: parseFloat(amount) === q ? '#0891B2' : '#164E63',
                }}
                onClick={() => setAmount(String(q))}
              >
                ${q}
              </button>
            ))}
          </div>

          <label style={t.label}>Or enter amount (USD)</label>
          <input style={t.input} type="number" min="1" step="0.01" value={amount}
            onChange={e => setAmount(e.target.value)} placeholder="e.g. 50.00" required />

          <label style={t.label}>Payment Method</label>
          <select style={t.select} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <button
            type="submit"
            style={{
              ...t.btnFull,
              background: selectedActivity && !loading ? '#F97316' : '#e0f2fe',
              color: selectedActivity && !loading ? '#fff' : '#94a3b8',
              cursor: selectedActivity && !loading ? 'pointer' : 'not-allowed',
            }}
            disabled={!selectedActivity || loading}
          >
            {loading ? 'Processing…' : `Confirm Donation${amount ? ` of $${parseFloat(amount || 0).toFixed(2)}` : ''}`}
          </button>
        </form>
      </div>
    </div>
  )
}
