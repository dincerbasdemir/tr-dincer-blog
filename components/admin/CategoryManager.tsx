'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

function turkishSlugify(text: string): string {
  const map: Record<string, string> = {
    'ğ': 'g', 'Ğ': 'g', 'ü': 'u', 'Ü': 'u', 'ş': 's', 'Ş': 's',
    'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c',
  }
  return text
    .split('')
    .map(c => map[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    const name = newName.trim()
    if (!name) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Kategori eklenemedi')
      const created = await res.json()
      setCategories(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name, 'tr')))
      setNewName('')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
  }

  async function handleSave(id: string) {
    const name = editName.trim()
    if (!name) return
    const slug = turkishSlugify(name)
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      })
      if (!res.ok) throw new Error('Kategori güncellenemedi')
      const updated = await res.json()
      setCategories(prev =>
        prev.map(c => (c.id === id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name, 'tr'))
      )
      setEditingId(null)
      setEditName('')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Kategori silinemedi')
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
            Kategoriler
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            {categories.length} kategori
          </p>
        </div>
      </div>

      {/* Add Form */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Yeni kategori adı"
          style={{
            flex: 1, maxWidth: '360px',
            padding: '10px 14px', borderRadius: '8px',
            border: '1px solid #e5e7eb', fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !newName.trim()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: '#111827', color: 'white',
            padding: '10px 18px', borderRadius: '8px', border: 'none',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            opacity: loading || !newName.trim() ? 0.5 : 1,
          }}
        >
          + Ekle
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {categories.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
            <p style={{ fontSize: '14px', margin: 0 }}>Henüz kategori yok.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                {['Ad', 'Slug', ''].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 700, color: '#9ca3af',
                    textTransform: 'uppercase' as const, letterSpacing: '0.07em', whiteSpace: 'nowrap' as const,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} style={{ borderBottom: i < categories.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                  <td style={{ padding: '14px 20px' }}>
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSave(cat.id)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        autoFocus
                        style={{
                          padding: '6px 10px', borderRadius: '6px',
                          border: '1px solid #e5e7eb', fontSize: '14px',
                          outline: 'none', width: '100%', maxWidth: '280px',
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {cat.name}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#c4c7d0' }}>
                      {editingId === cat.id ? turkishSlugify(editName) : cat.slug}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleSave(cat.id)}
                            disabled={loading || !editName.trim()}
                            style={{
                              fontSize: '12px', fontWeight: 600, color: 'white',
                              backgroundColor: '#111827', border: 'none',
                              padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                              opacity: loading || !editName.trim() ? 0.5 : 1,
                            }}
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              fontSize: '12px', fontWeight: 600, color: '#374151',
                              backgroundColor: 'transparent', border: '1px solid #e5e7eb',
                              padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                            }}
                          >
                            İptal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            style={{
                              fontSize: '12px', fontWeight: 600, color: '#374151',
                              backgroundColor: 'transparent', border: '1px solid #e5e7eb',
                              padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                              textDecoration: 'none', whiteSpace: 'nowrap' as const,
                            }}
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            disabled={loading}
                            style={{
                              fontSize: '12px', fontWeight: 600, color: '#dc2626',
                              backgroundColor: 'transparent', border: '1px solid #fecaca',
                              padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                              whiteSpace: 'nowrap' as const,
                            }}
                          >
                            Sil
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
