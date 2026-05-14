import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const CATEGORY_THEMES = {
  'Medical':        { gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0891B2 100%)', light: '#ecfeff', text: '#0e7490', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  'Education':      { gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', light: '#fff7ed', text: '#c2410c', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
  'Environment':    { gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', light: '#f0fdf4', text: '#15803d', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.7a1 1 0 0 0 1.68 1.09C9 16.5 14 15 21 15c0-6.59-4-7-4-7z"/><path d="M3.5 14.5c2-3.5 5-5 9-5"/></svg> },
  'Community':      { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', light: '#fdf4ff', text: '#6d28d9', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  'Disaster Relief': { gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', light: '#fef2f2', text: '#b91c1c', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
}

const DEFAULT_THEME = { gradient: 'linear-gradient(135deg, #0891B2 0%, #0e7490 100%)', light: '#ecfeff', text: '#0e7490', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> }

function getCategoryTheme(name) {
  return CATEGORY_THEMES[name] || DEFAULT_THEME
}

function ActivityCard({ a, onClick }) {
  const [hovered, setHovered] = useState(false)
  const goal = parseFloat(a.goal_amount)
  const current = parseFloat(a.current_amount)
  const pct = goal > 0 ? Math.min(Math.round((current / goal) * 100), 100) : 0
  const theme = getCategoryTheme(a.category?.name)
  const isAlmostFunded = pct >= 75 && pct < 100
  const isFunded = pct >= 100

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 16px 48px rgba(8,145,178,0.16), 0 4px 12px rgba(0,0,0,0.06)'
          : '0 2px 8px rgba(8,145,178,0.08)',
        cursor: 'pointer',
        border: `1px solid ${hovered ? '#a5f3fc' : '#e0f2fe'}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Gradient image header */}
      <div style={{
        background: theme.gradient,
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-10px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

        {/* Icon */}
        <div style={{ color: 'rgba(255,255,255,0.9)', zIndex: 1, marginBottom: '8px' }}>
          {theme.icon}
        </div>

        {/* Category label */}
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: '99px',
          padding: '3px 12px',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          zIndex: 1,
        }}>
          {a.category?.name || 'General'}
        </div>

        {/* Status badge */}
        {(isAlmostFunded || isFunded) && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: isFunded ? '#10b981' : '#F97316',
            color: '#fff',
            borderRadius: '99px',
            padding: '3px 10px',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.3px',
            zIndex: 2,
          }}>
            {isFunded ? 'Goal Reached!' : 'Almost There!'}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#164E63', marginBottom: '8px', lineHeight: '1.4' }}>
          {a.title}
        </div>
        <div style={{ fontSize: '13px', color: '#4b7280', lineHeight: '1.65', marginBottom: '18px', flex: 1 }}>
          {a.description.substring(0, 100)}{a.description.length > 100 ? '…' : ''}
        </div>

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#164E63' }}>
              ${current.toLocaleString()} raised
            </span>
            <span style={{
              fontSize: '12px', fontWeight: '700',
              color: isFunded ? '#059669' : theme.text,
              background: isFunded ? '#dcfce7' : theme.light,
              padding: '2px 9px', borderRadius: '99px',
            }}>
              {pct}%
            </span>
          </div>

          <div style={{ height: '6px', background: '#e0f2fe', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: isFunded ? 'linear-gradient(90deg, #10b981, #059669)' : theme.gradient,
              borderRadius: '99px',
              transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{ fontSize: '12px', color: '#4b7280' }}>
            of ${goal.toLocaleString()} goal
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid #f0f9ff',
        background: hovered ? '#f0f9ff' : '#fff',
        transition: 'background 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '12px', color: '#4b7280', fontWeight: '500' }}>
          {a.fund_raiser || 'Campaign'}
        </span>
        <span style={{
          fontSize: '12px', fontWeight: '700', color: '#0891B2',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          Support now
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e0f2fe' }}>
      <div style={{ height: '140px', background: 'linear-gradient(135deg, #e0f2fe, #cffafe)' }} />
      <div style={{ padding: '20px' }}>
        <div style={{ width: '85%', height: '18px', background: '#f0f9ff', borderRadius: '6px', marginBottom: '10px' }} />
        <div style={{ width: '100%', height: '13px', background: '#f0f9ff', borderRadius: '4px', marginBottom: '6px' }} />
        <div style={{ width: '70%', height: '13px', background: '#f0f9ff', borderRadius: '4px', marginBottom: '20px' }} />
        <div style={{ height: '6px', background: '#e0f2fe', borderRadius: '99px', marginBottom: '8px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '90px', height: '14px', background: '#e0f2fe', borderRadius: '4px' }} />
          <div style={{ width: '40px', height: '18px', background: '#e0f2fe', borderRadius: '99px' }} />
        </div>
      </div>
    </div>
  )
}

const ALL_CATEGORIES = ['All', 'Medical', 'Education', 'Environment', 'Community', 'Disaster Relief']

export default function BrowsePage() {
  const [activities, setActivities] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/activities/browse')
      .then(r => {
        const data = r.data.activities || []
        setActivities(data)
        setFiltered(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filterByCategory = (cat) => {
    setActiveCategory(cat)
    if (cat === 'All') setFiltered(activities)
    else setFiltered(activities.filter(a => a.category?.name === cat))
  }

  const availableCategories = ['All', ...new Set(activities.map(a => a.category?.name).filter(Boolean))]

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto 80px', padding: '0 20px' }}>

      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, #07223d 0%, #0e4a6e 100%)',
        margin: '0 -20px 40px',
        padding: '48px 40px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(249,115,22,0.07)', borderRadius: '50%', filter: 'blur(40px)' }} />

        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '8px', position: 'relative' }}>
          Browse Campaigns
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', position: 'relative' }}>
          {loading ? 'Loading campaigns…' : `${activities.length} active campaigns — find a cause you care about`}
        </p>
      </div>

      {/* Category filter pills */}
      {!loading && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {availableCategories.map(cat => {
            const active = activeCategory === cat
            const theme = cat !== 'All' ? getCategoryTheme(cat) : null
            return (
              <button
                key={cat}
                onClick={() => filterByCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '99px',
                  border: active ? 'none' : '1.5px solid #a5f3fc',
                  background: active ? (theme ? theme.gradient : 'linear-gradient(135deg, #0891B2, #0e7490)') : '#fff',
                  color: active ? '#fff' : '#0e7490',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: active ? '0 4px 12px rgba(8,145,178,0.25)' : 'none',
                }}
              >
                {cat}
                {cat !== 'All' && (
                  <span style={{
                    marginLeft: '6px',
                    background: active ? 'rgba(255,255,255,0.25)' : '#ecfeff',
                    color: active ? '#fff' : '#0891B2',
                    borderRadius: '99px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}>
                    {activities.filter(a => a.category?.name === cat).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#a5f3fc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#164E63', marginBottom: '8px' }}>No campaigns found</div>
          <div style={{ fontSize: '14px', color: '#4b7280', marginBottom: '20px' }}>Try a different category filter</div>
          <button onClick={() => filterByCategory('All')} style={{ padding: '10px 24px', background: '#0891B2', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
            Show All Campaigns
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {filtered.map(a => (
            <ActivityCard key={a.id} a={a} onClick={() => navigate(`/activity/${a.id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}
