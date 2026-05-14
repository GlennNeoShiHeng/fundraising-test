import { useState, useEffect } from 'react'
import api from '../services/api'
import { t } from '../theme'

export default function DoneeProfile() {
  const [form, setForm] = useState({ name: '', email: '', phone_number: '', address: '', date_of_birth: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/profile').then(r => {
      if (r.data.profile) setForm({ ...r.data.profile, date_of_birth: r.data.profile.date_of_birth || '' })
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(''); setError(''); setLoading(true)
    try {
      const res = await api.post('/profile', form)
      setSuccess(res.data.message)
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text') => (
    <>
      <label style={t.label}>{label}</label>
      <input style={t.input} type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
    </>
  )

  return (
    <div style={t.page('600px')}>
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(34,211,238,0.15)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>MY ACCOUNT</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>My Profile</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Keep your information up to date.</p>

        {form.name && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', position: 'relative' }}>
            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #0891B2, #22d3ee)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              {form.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{form.name}</div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>{form.email}</div>
            </div>
          </div>
        )}
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
          {field('name', 'Full Name')}
          {field('email', 'Email Address', 'email')}
          {field('phone_number', 'Phone Number', 'tel')}
          {field('address', 'Address')}
          {field('date_of_birth', 'Date of Birth', 'date')}
          <button
            style={{ ...t.btnFull, opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
