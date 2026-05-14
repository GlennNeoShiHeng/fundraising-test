import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ICONS = {
  search: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  heart:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  message:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  target: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  chart:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  users:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
}

const ICON_COLORS = {
  'Search Campaigns': { bg: '#ecfeff', color: '#0891B2' },
  'Track Donations':  { bg: '#fff7ed', color: '#ea580c' },
  'Share Feedback':   { bg: '#f0fdf4', color: '#16a34a' },
  'Create Campaigns': { bg: '#fef3c7', color: '#d97706' },
  'Analytics':        { bg: '#fdf4ff', color: '#9333ea' },
  'User Management':  { bg: '#fef2f2', color: '#dc2626' },
}

const ROLE_FILTER = {
  'Track Donations':  ['donee'],
  'Share Feedback':   ['donee'],
  'Create Campaigns': ['fund_raiser'],
  'Analytics':        ['platform_manager'],
  'User Management':  ['user_admin'],
}

const ALL_FEATURES = [
  { icon: ICONS.search,  title: 'Search Campaigns',  desc: 'Browse fundraising activities by keyword or category.' },
  { icon: ICONS.heart,   title: 'Track Donations',   desc: "Monitor the progress of causes you've contributed to." },
  { icon: ICONS.message, title: 'Share Feedback',    desc: 'Help improve the platform by reporting issues or suggestions.' },
  { icon: ICONS.target,  title: 'Create Campaigns',  desc: 'Fund Raisers can launch and manage their own campaigns.' },
  { icon: ICONS.chart,   title: 'Analytics',         desc: 'Platform managers can track feedback trends and insights.' },
  { icon: ICONS.users,   title: 'User Management',   desc: 'Admins control accounts and roles across the platform.' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Browse Campaigns',
    desc: 'Explore hundreds of verified fundraising campaigns across education, health, community, and more.',
    color: '#0891B2',
    bg: '#ecfeff',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
  {
    step: '02',
    title: 'Choose a Cause',
    desc: 'Find a campaign that resonates with you. Read the story, track progress, and see the impact.',
    color: '#F97316',
    bg: '#fff7ed',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    step: '03',
    title: 'Make an Impact',
    desc: 'Donate securely and track how your contribution helps the campaign reach its goal.',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  },
]

function FeatureCard({ f, link, navigate }) {
  const [hovered, setHovered] = useState(false)
  const colors = ICON_COLORS[f.title] || { bg: '#f0f9ff', color: '#0891B2' }

  return (
    <div
      onClick={() => link && navigate(link)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '28px 24px',
        boxShadow: hovered ? '0 12px 40px rgba(8,145,178,0.14)' : '0 2px 8px rgba(8,145,178,0.07)',
        cursor: link ? 'pointer' : 'default',
        border: `1px solid ${hovered && link ? '#a5f3fc' : '#e0f2fe'}`,
        transform: hovered && link ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.22s ease',
      }}
    >
      <div style={{ width: '52px', height: '52px', background: colors.bg, color: colors.color, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
        {f.icon}
      </div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#164E63', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {f.title}
        {link && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
      </div>
      <div style={{ fontSize: '13px', color: '#4b7280', lineHeight: '1.65' }}>{f.desc}</div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getCardLink = (title) => {
    if (!user) return null
    if (title === 'Create Campaigns' && user.role === 'fund_raiser') return '/activity/create'
    if (title === 'Track Donations' && user.role === 'donee') return '/donate'
    if (title === 'Share Feedback' && user.role === 'donee') return '/feedback'
    if (title === 'Analytics' && user.role === 'platform_manager') return '/feedback/trends'
    if (title === 'User Management' && user.role === 'user_admin') return '/admin/users'
    return null
  }

  const features = user
    ? ALL_FEATURES.filter(f => !ROLE_FILTER[f.title] || ROLE_FILTER[f.title].includes(user.role))
    : ALL_FEATURES

  return (
    <>
      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 50%, #0891B2 100%)',
        color: '#fff',
        padding: '100px 20px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '-60px', left: '5%', width: '400px', height: '400px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '8%', width: '340px', height: '340px', background: 'rgba(34,211,238,0.09)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '45%', width: '180px', height: '180px', background: 'rgba(249,115,22,0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '99px', padding: '6px 16px', fontSize: '13px', color: '#fdba74', marginBottom: '28px', fontWeight: '600' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F97316"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Trusted fundraising platform
          </div>

          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '22px' }}>
            Every Gift Creates<br />
            <span style={{ background: 'linear-gradient(90deg, #22d3ee 0%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Real Change
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.75' }}>
            Support causes that matter. Every contribution brings someone closer to their goal and changes a life.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F97316', color: '#fff', padding: '15px 32px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', boxShadow: '0 6px 24px rgba(249,115,22,0.45)' }}>
              Browse Campaigns
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            {!user && (
              <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)', padding: '15px 32px', borderRadius: '12px', fontWeight: '600', fontSize: '15px' }}>
                Search Causes
              </Link>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '64px', justifyContent: 'center', marginTop: '72px', flexWrap: 'wrap' }}>
            {[
              { value: '1,200+', label: 'Campaigns', color: '#22d3ee' },
              { value: '$2.4M',  label: 'Raised',    color: '#F97316' },
              { value: '8,500+', label: 'Donors',    color: '#22d3ee' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '34px', fontWeight: '800', color: stat.color, lineHeight: '1' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
            <path d="M0 60V30C240 0 480 0 720 20C960 40 1200 50 1440 30V60H0Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '72px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'inline-block', background: '#ecfeff', color: '#0891B2', borderRadius: '99px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
            How It Works
          </div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '30px', fontWeight: '700', color: '#164E63', marginBottom: '10px' }}>
            Making a difference is simple
          </h2>
          <p style={{ color: '#4b7280', fontSize: '15px', lineHeight: '1.7', maxWidth: '460px', margin: '0 auto' }}>
            Join thousands of people who are changing lives through the power of collective giving.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '32px 28px', border: '1px solid #e0f2fe', boxShadow: '0 2px 8px rgba(8,145,178,0.07)', position: 'relative', overflow: 'hidden' }}>
              {/* Big step number watermark */}
              <div style={{ position: 'absolute', top: '-10px', right: '16px', fontFamily: "'Poppins', sans-serif", fontSize: '80px', fontWeight: '800', color: step.bg, lineHeight: '1', userSelect: 'none' }}>
                {step.step}
              </div>
              <div style={{ width: '56px', height: '56px', background: step.bg, color: step.color, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
                {step.icon}
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '17px', fontWeight: '700', color: '#164E63', marginBottom: '10px' }}>{step.title}</div>
              <div style={{ fontSize: '14px', color: '#4b7280', lineHeight: '1.7' }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories strip ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #e0f2fe', borderBottom: '1px solid #e0f2fe', padding: '32px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Campaign categories</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { name: 'Medical',         color: '#0891B2', bg: '#ecfeff' },
              { name: 'Education',       color: '#ea580c', bg: '#fff7ed' },
              { name: 'Environment',     color: '#16a34a', bg: '#f0fdf4' },
              { name: 'Community',       color: '#7c3aed', bg: '#fdf4ff' },
              { name: 'Disaster Relief', color: '#dc2626', bg: '#fef2f2' },
            ].map(cat => (
              <Link key={cat.name} to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: cat.bg, color: cat.color, borderRadius: '99px', padding: '8px 18px', fontSize: '13px', fontWeight: '700', border: `1.5px solid ${cat.bg}`, transition: 'all 0.2s' }}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ maxWidth: '980px', margin: '72px auto 80px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '700', color: '#164E63', marginBottom: '10px' }}>
            Everything you need
          </h2>
          <p style={{ color: '#4b7280', fontSize: '15px', lineHeight: '1.6' }}>
            Tools designed for every role in the fundraising ecosystem
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {features.map(f => (
            <FeatureCard key={f.title} f={f} link={getCardLink(f.title)} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      {!user && (
        <div style={{ background: 'linear-gradient(135deg, #07223d 0%, #0891B2 100%)', padding: '64px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', left: '10%', width: '200px', height: '200px', background: 'rgba(249,115,22,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '10%', width: '200px', height: '200px', background: 'rgba(34,211,238,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
              Ready to make a difference?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px', lineHeight: '1.7' }}>
              Join thousands of donors supporting causes that matter.
            </p>
            <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F97316', color: '#fff', padding: '15px 36px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', boxShadow: '0 6px 24px rgba(249,115,22,0.45)' }}>
              Start Giving Today
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
