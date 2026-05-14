// Shared design tokens — import as: import { t } from '../../theme'
// Design system: Non-profit/Charity — compassion teal #0891B2 + action orange #F97316

export const t = {
  // Page wrapper
  page: (maxWidth = '900px') => ({
    maxWidth, margin: '0 auto', padding: '40px 20px 80px',
  }),

  // Typography
  pageTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#164E63', letterSpacing: '-0.4px',
  },
  pageSub: { color: '#4b7280', marginBottom: '28px', fontSize: '14px', lineHeight: '1.6' },
  sectionTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px', fontWeight: '700', color: '#164E63', marginBottom: '18px',
  },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#164E63' },
  meta: { fontSize: '13px', color: '#4b7280' },

  // Cards
  card: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    boxShadow: '0 1px 4px rgba(8,145,178,0.07)', border: '1px solid #e0f2fe',
  },
  cardLg: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    boxShadow: '0 1px 4px rgba(8,145,178,0.07)', border: '1px solid #e0f2fe',
  },
  cardList: {
    background: '#fff', borderRadius: '14px', padding: '18px 20px',
    boxShadow: '0 1px 4px rgba(8,145,178,0.06)', border: '1px solid #e0f2fe',
    marginBottom: '12px',
  },

  // Form
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#164E63', marginBottom: '6px' },
  input: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #a5f3fc',
    borderRadius: '10px', fontSize: '14px', marginBottom: '16px',
    outline: 'none', color: '#164E63', background: '#fff', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #a5f3fc',
    borderRadius: '10px', fontSize: '14px', marginBottom: '16px',
    background: '#fff', color: '#164E63', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #a5f3fc',
    borderRadius: '10px', fontSize: '14px', marginBottom: '16px',
    resize: 'vertical', minHeight: '120px', color: '#164E63',
    background: '#fff', boxSizing: 'border-box',
  },

  // Buttons
  btn: {
    padding: '10px 22px', background: '#0891B2', color: '#fff', border: 'none',
    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
  },
  btnFull: {
    width: '100%', padding: '12px', background: '#F97316', color: '#fff', border: 'none',
    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '15px',
  },
  btnGhost: {
    padding: '10px 18px', background: '#ecfeff', color: '#0e7490',
    border: '1px solid #a5f3fc', borderRadius: '10px', fontWeight: '600',
    cursor: 'pointer', fontSize: '14px',
  },
  btnDanger: {
    padding: '10px 22px', background: '#dc2626', color: '#fff', border: 'none',
    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
  },
  btnSmDanger: {
    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
    borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  btnSmWarn: {
    background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a',
    borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  btnSmSuccess: {
    background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
    borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  btnSmIndigo: {
    background: '#ecfeff', color: '#0891B2', border: '1px solid #a5f3fc',
    borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },

  // Alerts
  alertSuccess: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    color: '#15803d', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px', fontWeight: '600',
  },
  alertError: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '13px',
  },
  alertInfo: {
    background: '#ecfeff', border: '1px solid #a5f3fc',
    color: '#0e7490', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '13px', lineHeight: '1.6',
  },

  // Progress
  progressBg: { background: '#e0f2fe', borderRadius: '99px', height: '8px', margin: '10px 0' },
  progressBgSm: { background: '#e0f2fe', borderRadius: '99px', height: '6px', margin: '8px 0' },
  progressFill: (pct) => ({
    height: '100%', width: `${Math.min(pct, 100)}%`, borderRadius: '99px',
    background: pct >= 100
      ? 'linear-gradient(90deg, #10b981, #059669)'
      : 'linear-gradient(90deg, #22d3ee, #0891B2)',
  }),

  // Filters panel
  filters: {
    display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px',
    background: '#ecfeff', padding: '16px 20px', borderRadius: '12px',
    border: '1px solid #a5f3fc', alignItems: 'center',
  },
  filterEl: {
    flex: '1', minWidth: '160px', padding: '9px 14px',
    border: '1.5px solid #a5f3fc', borderRadius: '10px',
    fontSize: '14px', background: '#fff', color: '#164E63',
  },

  // Empty state
  empty: { textAlign: 'center', color: '#4b7280', padding: '64px 0', fontSize: '15px' },

  // Table
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '10px 14px', fontSize: '11px',
    fontWeight: '700', color: '#4b7280', borderBottom: '2px solid #e0f2fe',
    textTransform: 'uppercase', letterSpacing: '0.6px',
  },
  td: { padding: '12px 14px', fontSize: '14px', borderBottom: '1px solid #f0f9ff', color: '#164E63' },

  // Modals
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(7,34,61,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    maxWidth: '420px', width: '90%',
    boxShadow: '0 20px 60px rgba(8,145,178,0.2)',
  },
  modalTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#164E63',
  },

  // Badge helpers
  badge: {
    active:    { background: '#dcfce7', color: '#16a34a', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    inactive:  { background: '#f3f4f6', color: '#9ca3af', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    pending:   { background: '#fef3c7', color: '#d97706', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    cancelled: { background: '#fee2e2', color: '#dc2626', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    completed: { background: '#dcfce7', color: '#059669', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    approved:  { background: '#dcfce7', color: '#059669', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    rejected:  { background: '#fee2e2', color: '#dc2626', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    indigo:    { background: '#ecfeff', color: '#0891B2', borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  },

  // Infobox (left accent strip)
  accentCard: {
    background: '#f0f9ff', borderRadius: '10px', padding: '16px 20px',
    marginBottom: '12px', borderLeft: '4px solid #0891B2',
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
  },

  // Back button
  backBtn: {
    background: 'none', border: 'none', color: '#0891B2', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', marginBottom: '20px', padding: '0',
    display: 'flex', alignItems: 'center', gap: '4px',
  },
}
