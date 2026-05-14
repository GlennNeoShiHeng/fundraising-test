// Story #13 (D007) - Set Up Monthly Recurring Donations (Donee)
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

export default function RecurringDonationPage() {
  const { token } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [myDonations, setMyDonations] = useState([])
  const [form, setForm] = useState({ activity_id: '', amount: '', start_date: '', payment_method: 'Credit Card' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    const [campRes, donRes] = await Promise.all([
      fetch(`${API}/search`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API}/recurring-donations`, { headers: { Authorization: `Bearer ${token}` } })
    ])
    const campData = await campRes.json()
    const donData = await donRes.json()
    setCampaigns(Array.isArray(campData) ? campData : [])
    setMyDonations(Array.isArray(donData) ? donData : [])
    setLoading(false)
  }

  useEffect(() => { if (token) loadData() }, [token])

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  const selectCampaign = (e) => handleChange('activity_id')(e)

  const submitRecurringDonation = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const res = await fetch(`${API}/recurring-donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) })
    })
    const data = await res.json()
    if (!res.ok) return showErrorMessages(data.error || 'Failed to set up recurring donation')
    setForm({ activity_id: '', amount: '', start_date: '', payment_method: 'Credit Card' })
    showConfirmationMessage('Recurring donation set up successfully! Your first payment has been processed.')
    loadData()
  }

  const cancelRecurringDonation = async (id) => {
    setError(''); setSuccess('')
    const res = await fetch(`${API}/recurring-donations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) return showErrorMessages(data.error || 'Failed to cancel')
    showConfirmationMessage('Recurring donation cancelled successfully.')
    loadData()
  }

  const showConfirmationMessage = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const showErrorMessages = (msg) => setError(msg)

  const formatDate = (d) => new Date(d).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
  const today = new Date().toISOString().split('T')[0]

  const activeDonations = myDonations.filter(d => d.is_active)

  return (
    <div style={t.page('800px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(249,115,22,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <span style={{ color: '#F97316', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>AUTO-DONATE</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Recurring Donations</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Set up automatic monthly donations to causes you care about.</p>

        {activeDonations.length > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
              <div style={{ color: '#F97316', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{activeDonations.length}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Active Recurring</div>
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

      {/* Set Up Form */}
      <div style={{ ...t.cardLg, marginBottom: '24px' }}>
        <div style={t.sectionTitle}>Set Up New Recurring Donation</div>
        <div style={{ ...t.alertInfo, marginBottom: '20px' }}>
          Your first donation will be processed immediately. Subsequent payments will be made monthly on the same date.
        </div>
        <form onSubmit={submitRecurringDonation}>
          <label style={t.label}>Select Campaign</label>
          <select style={t.select} value={form.activity_id} onChange={selectCampaign} required>
            <option value="">Choose a campaign...</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.title} ({c.category})</option>
            ))}
          </select>

          <label style={t.label}>Monthly Donation Amount ($)</label>
          <input style={t.input} type="number" min="1" step="0.01" value={form.amount} onChange={handleChange('amount')} placeholder="e.g. 20.00" required />

          <label style={t.label}>Start Date</label>
          <input style={t.input} type="date" min={today} value={form.start_date} onChange={handleChange('start_date')} required />

          <label style={t.label}>Payment Method</label>
          <select style={t.select} value={form.payment_method} onChange={handleChange('payment_method')} required>
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>PayNow</option>
            <option>Bank Transfer</option>
          </select>

          <button style={t.btnFull} type="submit">Set Up Recurring Donation</button>
        </form>
      </div>

      {/* My Recurring Donations */}
      <div style={t.cardLg}>
        <div style={{ ...t.sectionTitle, marginBottom: '16px' }}>My Recurring Donations</div>
        {loading && <div style={t.empty}>Loading…</div>}
        {!loading && myDonations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4b7280' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔄</div>
            <div style={{ fontSize: '14px' }}>No recurring donations set up yet.</div>
          </div>
        )}
        {myDonations.map(d => (
          <div key={d.id} style={{ ...t.accentCard, marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#164E63', marginBottom: '6px' }}>{d.activity_title}</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={d.is_active ? t.badge.active : t.badge.cancelled}>{d.is_active ? 'Active' : 'Cancelled'}</span>
                <span style={t.badge.indigo}>{d.category}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4b7280', lineHeight: '1.8' }}>
                <div><strong style={{ color: '#F97316' }}>${parseFloat(d.amount).toFixed(2)}</strong> / month · {d.payment_method}</div>
                <div>Started: {formatDate(d.start_date)}</div>
                {d.is_active && <div>Next payment: {formatDate(d.next_payment_date)}</div>}
              </div>
            </div>
            {d.is_active && (
              <button
                style={t.btnSmDanger}
                onClick={() => cancelRecurringDonation(d.id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
