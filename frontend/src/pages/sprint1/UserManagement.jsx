// Story #48 (UA01) - Create User Account
// Story #57 (UA02) - View and Search User Accounts
// Story #59 (UA03) - Deactivate User Account
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../theme'

const API = (import.meta.env.VITE_API_URL || '') + '/api'
const ROLES = ['donee', 'fund_raiser', 'platform_manager', 'user_admin']
const ROLE_LABELS = { donee: 'Donee', fund_raiser: 'Fund Raiser', platform_manager: 'Platform Manager', user_admin: 'User Admin' }

const roleBadgeStyle = (role) => {
  const map = {
    donee:            { background: '#dbeafe', color: '#1d4ed8' },
    fund_raiser:      { background: '#dcfce7', color: '#15803d' },
    platform_manager: { background: '#fef9c3', color: '#ca8a04' },
    user_admin:       { background: '#ede9fe', color: '#7c3aed' },
  }
  const c = map[role] || { background: '#f1f5f9', color: '#475569' }
  return { ...c, borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', display: 'inline-block' }
}

export default function UserManagement() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donee' })
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmUser, setConfirmUser] = useState(null)
  const [reactivateUser, setReactivateUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  const userList = async () => {
    const res = await fetch(`${API}/users`, authHeaders)
    const data = await res.json()
    setUsers(Array.isArray(data.users) ? data.users : [])
  }

  useEffect(() => { if (token) userList() }, [token])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSuccess(''); setErrors([]); setLoading(true)
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess(`User "${form.name}" created successfully!`)
      setForm({ name: '', email: '', password: '', role: 'donee' })
      userList()
    } else {
      setErrors(data.errors || [data.error || 'Failed to create user'])
    }
    setLoading(false)
  }

  const searchKeyword = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return
    setSearchError('')
    const res = await fetch(`${API}/users/search?keyword=${encodeURIComponent(keyword)}`, authHeaders)
    const data = await res.json()
    if (res.ok) { setUsers(data.users); setSearchMode(true) }
    else setSearchError('Search failed. Try again.')
  }

  const handleClearSearch = () => { setKeyword(''); setSearchMode(false); setSearchError(''); userList() }

  const selectedUser_handler = async (userId) => {
    const res = await fetch(`${API}/users/${userId}`, authHeaders)
    const data = await res.json()
    if (res.ok) setSelectedUser(data.user)
  }

  const selectDeactivateUser = (e, user) => {
    e.stopPropagation()
    if (!user.is_active) return
    setConfirmUser(user)
  }

  const confirmationDeactivateUserOption = async () => {
    const res = await fetch(`${API}/deactivate/${confirmUser.id}`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
    })
    setConfirmUser(null)
    if (res.ok) {
      setSuccess(`${confirmUser.name}'s account has been deactivated.`)
      setTimeout(() => setSuccess(''), 4000)
      setUsers(prev => prev.map(u => u.id === confirmUser.id ? { ...u, is_active: false } : u))
    }
  }

  const handleReactivateConfirm = async () => {
    const res = await fetch(`${API}/deactivate/${reactivateUser.id}/reactivate`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
    })
    setReactivateUser(null)
    if (res.ok) {
      setSuccess(`${reactivateUser.name}'s account has been reactivated.`)
      setTimeout(() => setSuccess(''), 4000)
      setUsers(prev => prev.map(u => u.id === reactivateUser.id ? { ...u, is_active: true } : u))
    }
  }

  const handleDeleteConfirm = async () => {
    const res = await fetch(`${API}/users/${deleteUser.id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    })
    setDeleteUser(null)
    if (res.ok) {
      setSuccess(`${deleteUser.name}'s account has been deleted.`)
      setTimeout(() => setSuccess(''), 4000)
      setUsers(prev => prev.filter(u => u.id !== deleteUser.id))
    }
  }

  const activeCount = users.filter(u => u.is_active).length

  return (
    <div style={t.page('1100px')}>
      {/* Admin Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(139,92,246,0.06)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>USER ADMIN</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>User Management</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Create, view, search, and manage user accounts.</p>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
            <div style={{ color: '#818cf8', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{users.length}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Users</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
            <div style={{ color: '#10b981', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{activeCount}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Active</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
            <div style={{ color: '#f87171', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{users.length - activeCount}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Inactive</div>
          </div>
        </div>
      </div>

      {success && (
        <div style={{ ...t.alertSuccess, marginBottom: '20px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '28px', alignItems: 'start' }}>
        {/* Create form */}
        <div style={t.card}>
          <div style={t.sectionTitle}>Create New User</div>
          {errors.length > 0 && <div style={{ ...t.alertError, marginBottom: '16px' }}>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}
          <form onSubmit={handleCreate}>
            <label style={t.label}>Full Name</label>
            <input style={t.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" required />
            <label style={t.label}>Email</label>
            <input style={t.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@email.com" required />
            <label style={t.label}>Password</label>
            <input style={t.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" required />
            <label style={t.label}>Role</label>
            <select style={t.select} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <button style={{ ...t.btnFull, opacity: loading ? 0.8 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create User'}
            </button>
          </form>
        </div>

        {/* User list */}
        <div style={t.card}>
          <div style={{ ...t.sectionTitle, marginBottom: '12px' }}>
            {searchMode ? `Results for "${keyword}"` : `All Users (${users.length})`}
          </div>

          <form onSubmit={searchKeyword} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              style={{ flex: 1, padding: '9px 14px', border: '1.5px solid #a5f3fc', borderRadius: '10px', fontSize: '14px', color: '#164E63', outline: 'none' }}
              value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search by name, email or role…"
            />
            <button type="submit" style={{ ...t.btn, padding: '9px 16px' }}>Search</button>
            {searchMode && <button type="button" style={t.btnGhost} onClick={handleClearSearch}>Clear</button>}
          </form>
          {searchError && <div style={{ ...t.alertError, marginBottom: '12px' }}>{searchError}</div>}

          <div style={{ overflowX: 'auto' }}>
            <table style={t.table}>
              <thead>
                <tr>
                  <th style={t.th}>Name</th>
                  <th style={t.th}>Email</th>
                  <th style={t.th}>Role</th>
                  <th style={t.th}>Status</th>
                  <th style={t.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" style={{ ...t.td, textAlign: 'center', color: '#94a3b8' }}>No users found</td></tr>
                ) : (
                  users.map(u => (
                    <tr
                      key={u.id}
                      onClick={() => selectedUser_handler(u.id)}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <td style={t.td}><strong>{u.name}</strong></td>
                      <td style={{ ...t.td, fontSize: '13px' }}>{u.email}</td>
                      <td style={t.td}><span style={roleBadgeStyle(u.role)}>{ROLE_LABELS[u.role]}</span></td>
                      <td style={t.td}>
                        {u.is_active
                          ? <span
                              style={{ ...t.badge.active, cursor: 'pointer' }}
                              onClick={(e) => selectDeactivateUser(e, u)}
                              title="Click to deactivate"
                            >Active</span>
                          : <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={t.badge.inactive}>Inactive</span>
                              <button style={t.btnSmIndigo} onClick={(e) => { e.stopPropagation(); setReactivateUser(u) }}>Reactivate</button>
                            </span>
                        }
                      </td>
                      <td style={t.td}>
                        <button style={t.btnSmDanger} onClick={(e) => { e.stopPropagation(); setDeleteUser(u) }}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>Click a row to view details · Click <strong>Active</strong> to deactivate</p>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div style={t.overlay} onClick={() => setSelectedUser(null)}>
          <div style={t.modal} onClick={e => e.stopPropagation()}>
            <div style={t.modalTitle}>User Details</div>
            {[['Name', selectedUser.name], ['Email', selectedUser.email], ['Account Created', new Date(selectedUser.createdAt).toLocaleDateString()]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '15px', color: '#164E63' }}>{val}</div>
              </div>
            ))}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>Role</div>
              <div><span style={roleBadgeStyle(selectedUser.role)}>{ROLE_LABELS[selectedUser.role]}</span></div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>Status</div>
              <div style={{ color: selectedUser.is_active ? '#16a34a' : '#dc2626', fontWeight: '600', fontSize: '15px' }}>
                {selectedUser.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <button style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#f0f9ff', border: '1px solid #a5f3fc', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#0891B2' }} onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Deactivate Confirm */}
      {confirmUser && (
        <div style={t.overlay} onClick={() => setConfirmUser(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(7,34,61,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <div style={t.modalTitle}>Deactivate Account?</div>
            <div style={{ color: '#4b7280', marginBottom: '24px', lineHeight: '1.6', fontSize: '14px' }}>
              You are about to deactivate <strong>{confirmUser.name}</strong>'s account ({confirmUser.email}).
              <br />They will no longer be able to log in.
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button style={t.btnGhost} onClick={() => setConfirmUser(null)}>Cancel</button>
              <button style={t.btnDanger} onClick={confirmationDeactivateUserOption}>Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Confirm */}
      {reactivateUser && (
        <div style={t.overlay} onClick={() => setReactivateUser(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(7,34,61,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>✅</div>
            <div style={t.modalTitle}>Reactivate Account?</div>
            <div style={{ color: '#4b7280', marginBottom: '24px', lineHeight: '1.6', fontSize: '14px' }}>
              Reactivate <strong>{reactivateUser.name}</strong>'s account ({reactivateUser.email})?<br />They will be able to log in again.
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button style={t.btnGhost} onClick={() => setReactivateUser(null)}>Cancel</button>
              <button style={{ ...t.btn, background: '#0891B2' }} onClick={handleReactivateConfirm}>Reactivate</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteUser && (
        <div style={t.overlay} onClick={() => setDeleteUser(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(7,34,61,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🗑️</div>
            <div style={t.modalTitle}>Delete User?</div>
            <div style={{ color: '#4b7280', marginBottom: '24px', lineHeight: '1.6', fontSize: '14px' }}>
              This will <strong>permanently delete</strong> <strong>{deleteUser.name}</strong>'s account ({deleteUser.email}).
              <br />This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button style={t.btnGhost} onClick={() => setDeleteUser(null)}>Cancel</button>
              <button style={t.btnDanger} onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
