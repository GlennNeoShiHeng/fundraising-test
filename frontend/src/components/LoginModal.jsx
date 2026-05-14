import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const THEMES = {
  user: {
    gradient: 'linear-gradient(135deg, #07223d 0%, #0e5a75 100%)',
    accent: '#0891B2',
    accentHover: '#0e7490',
    accentLight: 'rgba(34,211,238,0.15)',
    accentText: '#67e8f9',
    focusBorder: '#0891B2',
    focusShadow: 'rgba(8,145,178,0.12)',
    btnBg: '#F97316',
    btnHover: '#ea6c0a',
    btnShadow: 'rgba(249,115,22,0.4)',
    label: 'USER PORTAL',
    heading: 'Welcome back',
    sub: 'Sign in to discover and support campaigns',
    btnText: 'Sign in to Donate',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  staff: {
    gradient: 'linear-gradient(135deg, #0a1628 0%, #064e3b 100%)',
    accent: '#059669',
    accentHover: '#047857',
    accentLight: 'rgba(16,185,129,0.15)',
    accentText: '#6ee7b7',
    focusBorder: '#059669',
    focusShadow: 'rgba(5,150,105,0.12)',
    btnBg: '#059669',
    btnHover: '#047857',
    btnShadow: 'rgba(5,150,105,0.4)',
    label: 'STAFF PORTAL',
    heading: 'Staff sign in',
    sub: 'Manage campaigns, users, and platform settings',
    btnText: 'Sign in as Staff',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
}

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isStaff, setIsStaff] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const theme = isStaff ? THEMES.staff : THEMES.user

  const switchMode = (staff) => { setIsStaff(staff); setError('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password, isStaff)
      onClose()
      if (user.role === 'user_admin') navigate('/admin/users')
      else if (user.role === 'platform_manager') navigate('/feedback/trends')
      else if (user.role === 'donee') navigate('/search')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    border: `1.5px solid ${focusedField === field ? theme.focusBorder : '#a5f3fc'}`,
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    color: '#164E63', background: '#fff',
    boxShadow: focusedField === field ? `0 0 0 3px ${theme.focusShadow}` : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  })

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(7,34,61,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(7,34,61,0.25)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: theme.gradient, padding: '32px 32px 28px', position: 'relative', transition: 'background 0.3s' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: theme.accentLight, borderRadius: '10px', padding: '9px', color: theme.accentText }}>
              {theme.icon}
            </div>
            <span style={{ color: theme.accentText, fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>{theme.label}</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{theme.heading}</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>{theme.sub}</p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 32px 32px', background: '#f0f9ff' }}>

          {/* Toggle */}
          <div style={{ display: 'flex', background: '#e0f2fe', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
            {[{ label: 'User', staff: false }, { label: 'Staff', staff: true }].map(({ label, staff }) => {
              const active = isStaff === staff
              return (
                <button
                  key={label}
                  onClick={() => switchMode(staff)}
                  style={{
                    flex: 1, padding: '9px', border: 'none', borderRadius: '7px', cursor: 'pointer',
                    fontWeight: '600', fontSize: '13px',
                    background: active ? (staff ? '#059669' : '#F97316') : 'transparent',
                    color: active ? '#fff' : '#0e7490',
                    transition: 'all 0.2s',
                    boxShadow: active ? `0 2px 8px ${staff ? 'rgba(5,150,105,0.3)' : 'rgba(249,115,22,0.3)'}` : 'none',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#164E63', marginBottom: '6px' }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                placeholder="you@example.com" required style={inputStyle('email')}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#164E63', marginBottom: '6px' }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                placeholder="Enter your password" required style={inputStyle('password')}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: theme.btnBg, color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: `0 4px 16px ${theme.btnShadow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.85 : 1,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = theme.btnHover }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = theme.btnBg }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in…
                </>
              ) : theme.btnText}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#4b7280', marginTop: '16px' }}>
            {isStaff
              ? 'Fund raisers, platform managers and admins only'
              : 'Donors and campaign supporters sign in here'}
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
