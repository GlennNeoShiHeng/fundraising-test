// Story #59 (UA03) - Deactivate User Accounts (User Admin)
// BCE Boundary: DeactivateUserAccountUI
// Functions: searchUser(), selectUser(), selectDeactivateUser(), confirmationDeactivateUserOption()
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const API = (import.meta.env.VITE_API_URL || '') + '/api'

const s = {
  page: { maxWidth: '860px', margin: '40px auto', padding: '0 20px' },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1a1a2e' },
  sub: { color: '#888', marginBottom: '24px', fontSize: '14px' },
  searchRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
  input: { flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  btn: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  th: { background: '#f3f4f6', padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151', borderTop: '1px solid #f3f4f6' },
  deactivateBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  badge: (active) => ({ background: active ? '#dcfce7' : '#f3f4f6', color: active ? '#16a34a' : '#9ca3af', borderRadius: '99px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }),
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modalBox: { background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center' },
  modalTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1a1a2e' },
  modalText: { color: '#555', marginBottom: '24px', lineHeight: '1.6' },
  modalRow: { display: 'flex', gap: '12px', justifyContent: 'center' },
  cancelBtn: { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  confirmBtn: { background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#888', padding: '40px 0', fontSize: '14px' },
  success: { background: '#dcfce7', color: '#16a34a', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontWeight: '600' }
}

const ROLE_LABELS = { donee: 'Donee', fund_raiser: 'Fund Raiser', platform_manager: 'Platform Manager', user_admin: 'User Admin' }

export default function DeactivateUserPage() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filtered, setFiltered] = useState([])
  const [selected, setSelected] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const loadUsers = async () => {
    const res = await fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : [])
    setFiltered(Array.isArray(data) ? data : [])
  }

  useEffect(() => { if (token) loadUsers() }, [token])

  // searchUser() - filters displayed user list by name or email
  const searchUser = () => {
    const kw = searchKeyword.toLowerCase()
    setFiltered(users.filter(u => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw)))
  }

  // selectUser() - highlights a user from the list
  const selectUser = (user) => setSelected(user)

  // selectDeactivateUser() - initiates deactivation flow for selected user
  const selectDeactivateUser = (user) => {
    selectUser(user)
    setShowConfirm(true)
  }

  // confirmationDeactivateUserOption() - processes confirmed deactivation
  const confirmationDeactivateUserOption = async () => {
    const res = await fetch(`${API}/deactivate/${selected.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setShowConfirm(false)
    if (res.ok) {
      setSuccessMsg(`${selected.name}'s account has been deactivated.`)
      setTimeout(() => setSuccessMsg(''), 4000)
      setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, is_active: false } : u))
      setFiltered(prev => prev.map(u => u.id === selected.id ? { ...u, is_active: false } : u))
    }
  }

  return (
    <div style={s.page}>
      <div style={s.title}>Deactivate User Accounts</div>
      <div style={s.sub}>Search for a user account and deactivate it to restrict access.</div>

      {successMsg && <div style={s.success}>{successMsg}</div>}

      <div style={s.searchRow}>
        <input style={s.input} placeholder="Search by name or email..."
          value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchUser()} />
        <button style={s.btn} onClick={searchUser}>Search</button>
        <button style={{ ...s.btn, background: '#6b7280' }} onClick={() => { setSearchKeyword(''); setFiltered(users) }}>Clear</button>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Name</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>Role</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#888' }}>No users found.</td></tr>
          )}
          {filtered.map(u => (
            <tr key={u.id}>
              <td style={s.td}>{u.name}</td>
              <td style={s.td}>{u.email}</td>
              <td style={s.td}>{ROLE_LABELS[u.role] || u.role}</td>
              <td style={s.td}><span style={s.badge(u.is_active)}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
              <td style={s.td}>
                {u.is_active
                  ? <button style={s.deactivateBtn} onClick={() => selectDeactivateUser(u)}>Deactivate</button>
                  : <span style={{ color: '#9ca3af', fontSize: '13px' }}>Already inactive</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && selected && (
        <div style={s.modal}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Confirm Deactivation</div>
            <div style={s.modalText}>
              Are you sure you want to deactivate <strong>{selected.name}</strong>'s account?
              They will no longer be able to log in.
            </div>
            <div style={s.modalRow}>
              <button style={s.cancelBtn} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button style={s.confirmBtn} onClick={confirmationDeactivateUserOption}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
