import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

const ROLE_LABELS = {
  donee: 'Donee',
  fund_raiser: 'Fund Raiser',
  platform_manager: 'Manager',
  user_admin: 'Admin'
}

const NAV_LINKS = {
  donee: [
    { to: '/search', label: 'Search' },
    { to: '/donate', label: 'Donate' },
    { to: '/contributions', label: 'My Contributions' },
    { to: '/donation-history', label: 'Donation History' },
    { to: '/favourites', label: 'Favourites' },
    { to: '/recurring-donations', label: 'Recurring Donations' },
    { to: '/recommendations', label: 'Recommended' },
    { to: '/profile', label: 'My Profile' },
    { to: '/feedback', label: 'Submit Feedback' }
  ],
  fund_raiser: [
    { to: '/activity/create', label: 'Create Activity' },
    { to: '/activity/ongoing', label: 'Ongoing Campaigns' },
    { to: '/activity/history', label: 'Completed History' },
    { to: '/activity/performance', label: 'Performance' },
    { to: '/activity/manage', label: 'Manage Activities' }
  ],
  platform_manager: [
    { to: '/admin/categories', label: 'Categories' },
    { to: '/feedback/trends', label: 'Feedback Trends' },
    { to: '/reports', label: 'Reports' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/approval', label: 'Activity Approval' }
  ],
  user_admin: [
    { to: '/admin/users', label: 'Manage Users' }
  ]
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function ChevronDown({ open }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  const topLinkStyle = (path) => ({
    color: isActive(path) ? '#22d3ee' : hoveredLink === path ? '#cffafe' : '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
    padding: '4px 0',
    borderBottom: `2px solid ${isActive(path) ? '#22d3ee' : 'transparent'}`,
    transition: 'color 0.15s',
    cursor: 'pointer',
  })

  return (
    <>
      <nav style={{
        background: '#07223d',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        boxShadow: '0 2px 12px rgba(7,34,61,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Left: Logo + top-level links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '700',
            fontSize: '18px',
            letterSpacing: '-0.3px',
          }}>
            <span style={{ color: '#F97316' }}><HeartIcon /></span>
            FundRaise
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={topLinkStyle('/')}
              onMouseEnter={() => setHoveredLink('/')}
              onMouseLeave={() => setHoveredLink(null)}>
              Home
            </Link>
            <Link to="/browse" style={topLinkStyle('/browse')}
              onMouseEnter={() => setHoveredLink('/browse')}
              onMouseLeave={() => setHoveredLink(null)}>
              Browse
            </Link>
          </div>
        </div>

        {/* Right: Role menu + user info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && NAV_LINKS[user.role] && (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: menuOpen ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.06)',
                  color: menuOpen ? '#22d3ee' : '#cbd5e1',
                  border: `1px solid ${menuOpen ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s',
                }}
              >
                {ROLE_LABELS[user.role]} Menu
                <ChevronDown open={menuOpen} />
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 40px rgba(7,34,61,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                  padding: '6px',
                  minWidth: '210px',
                  zIndex: 200,
                  border: '1px solid #e0f2fe',
                }}>
                  {NAV_LINKS[user.role].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      style={{
                        display: 'block',
                        padding: '9px 14px',
                        fontSize: '14px',
                        fontWeight: isActive(link.to) ? '600' : '500',
                        color: isActive(link.to) ? '#0891B2' : '#164E63',
                        borderRadius: '8px',
                        background: isActive(link.to) ? '#ecfeff' : 'transparent',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { if (!isActive(link.to)) e.currentTarget.style.background = '#f0f9ff' }}
                      onMouseLeave={e => { if (!isActive(link.to)) e.currentTarget.style.background = 'transparent' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '600', lineHeight: '1.3' }}>{user.name}</div>
                <div style={{ color: '#22d3ee', fontSize: '11px', fontWeight: '500' }}>{ROLE_LABELS[user.role]}</div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #1e3a52',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.borderColor = '#4b7280' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#1e3a52' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: '#F97316',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.15s',
                boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea6c0a'}
              onMouseLeave={e => e.currentTarget.style.background = '#F97316'}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
