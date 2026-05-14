import { useState, useEffect } from 'react'
import api from '../../services/api'
import { t } from '../../theme'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [editError, setEditError] = useState('')
  const [deleteModal, setDeleteModal] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const loadCategories = () => api.get('/categories').then(r => setCategories(r.data.categories))
  useEffect(() => { loadCategories() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSuccess(''); setError(''); setLoading(true)
    try {
      await api.post('/categories', form)
      setSuccess(`Category "${form.name}" created successfully!`)
      setForm({ name: '', description: '' })
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    setEditError('')
    try {
      await api.put(`/categories/${editModal.id}`, { name: editModal.name, description: editModal.description })
      setSuccess('Category updated successfully!')
      setEditModal(null)
      loadCategories()
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update category')
    }
  }

  const handleDelete = async () => {
    setDeleteError('')
    try {
      await api.delete(`/categories/${deleteModal.id}`)
      setSuccess(`Category "${deleteModal.name}" deleted successfully!`)
      setDeleteModal(null)
      loadCategories()
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete category')
    }
  }

  return (
    <div style={t.page('960px')}>
      {/* Admin Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', margin: '-40px -20px 32px', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', background: 'rgba(139,92,246,0.06)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '10px', padding: '8px 10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          </div>
          <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>PLATFORM MANAGER</span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px', position: 'relative' }}>Category Management</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative' }}>Create, edit, and delete fundraising activity categories.</p>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', position: 'relative' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px' }}>
            <div style={{ color: '#818cf8', fontSize: '22px', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>{categories.length}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Categories</div>
          </div>
        </div>
      </div>

      {success && (
        <div style={{ ...t.alertSuccess, marginBottom: '20px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '28px', alignItems: 'start' }}>
        {/* Create form */}
        <div style={t.card}>
          <div style={t.sectionTitle}>Create New Category</div>
          {error && <div style={{ ...t.alertError, marginBottom: '16px' }}>{error}</div>}
          <form onSubmit={handleCreate}>
            <label style={t.label}>Category Name</label>
            <input style={t.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Medical" required />
            <label style={t.label}>Description</label>
            <textarea style={{ ...t.textarea, minHeight: '80px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this category…" />
            <button style={{ ...t.btnFull, opacity: loading ? 0.8 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Category list */}
        <div style={t.card}>
          <div style={{ ...t.sectionTitle, marginBottom: '16px' }}>All Categories ({categories.length})</div>
          <table style={t.table}>
            <thead>
              <tr>
                <th style={t.th}>Name</th>
                <th style={t.th}>Description</th>
                <th style={t.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="3" style={{ ...t.td, textAlign: 'center', color: '#94a3b8' }}>No categories yet</td></tr>
              ) : (
                categories.map(c => (
                  <tr
                    key={c.id}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={t.td}><strong style={{ color: '#0891B2' }}>{c.name}</strong></td>
                    <td style={{ ...t.td, color: '#4b7280', fontSize: '13px' }}>{c.description || '—'}</td>
                    <td style={t.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          style={t.btnSmWarn}
                          onClick={() => { setEditModal({ id: c.id, name: c.name, description: c.description || '' }); setEditError(''); setSuccess('') }}
                        >
                          Edit
                        </button>
                        <button
                          style={t.btnSmDanger}
                          onClick={() => { setDeleteModal({ id: c.id, name: c.name }); setDeleteError(''); setSuccess('') }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div style={t.overlay} onClick={() => setEditModal(null)}>
          <div style={t.modal} onClick={e => e.stopPropagation()}>
            <div style={t.modalTitle}>Edit Category</div>
            {editError && <div style={{ ...t.alertError, marginBottom: '12px' }}>{editError}</div>}
            <label style={t.label}>Category Name</label>
            <input style={t.input} value={editModal.name} onChange={e => setEditModal({ ...editModal, name: e.target.value })} />
            <label style={t.label}>Description</label>
            <textarea style={{ ...t.textarea, minHeight: '80px' }} value={editModal.description} onChange={e => setEditModal({ ...editModal, description: e.target.value })} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{ ...t.btnGhost, flex: 1 }} onClick={() => setEditModal(null)}>Cancel</button>
              <button style={{ flex: 1, padding: '10px', background: '#0891B2', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }} onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div style={t.overlay} onClick={() => setDeleteModal(null)}>
          <div style={{ ...t.modal, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🗑️</div>
            <div style={t.modalTitle}>Delete Category?</div>
            {deleteError && <div style={{ ...t.alertError, marginBottom: '12px' }}>{deleteError}</div>}
            <p style={{ color: '#4b7280', fontSize: '14px', marginBottom: '6px' }}>Are you sure you want to delete <strong>"{deleteModal.name}"</strong>?</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '0' }}>This action cannot be undone. Categories linked to active activities cannot be deleted.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{ ...t.btnGhost, flex: 1 }} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button style={{ flex: 1, padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
