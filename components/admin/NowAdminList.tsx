'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type NowItem = {
  id: string
  category: 'reading' | 'listening' | 'working' | 'watching'
  title: string
  subtitle: string | null
  url: string | null
  sort_order: number
  created_at: string
}

const CATEGORY_META = {
  reading:   { label: 'Okuyorum',  emoji: '📖', color: '#dbeafe', text: '#1d4ed8' },
  listening: { label: 'Dinliyorum', emoji: '🎵', color: '#fce7f3', text: '#be185d' },
  working:   { label: 'Çalışıyorum', emoji: '💻', color: '#dcfce7', text: '#15803d' },
  watching:  { label: 'İzliyorum', emoji: '📺', color: '#fef9c3', text: '#a16207' },
}

const CATEGORIES = ['reading', 'listening', 'working', 'watching'] as const

export default function NowAdminList({ initialItems }: { initialItems: NowItem[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  /* ── Form state ── */
  const [form, setForm] = useState({
    category: 'reading' as typeof CATEGORIES[number],
    title: '',
    subtitle: '',
    url: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Hata oluştu.')
      } else {
        setForm({ category: 'reading', title: '', subtitle: '', url: '' })
        startTransition(() => router.refresh())
      }
    } catch {
      setError('Bağlantı hatası.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu öğeyi silmek istediğine emin misin?')) return
    await fetch(`/api/admin/now/${id}`, { method: 'DELETE' })
    startTransition(() => router.refresh())
  }

  /* ── Group by category ── */
  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = initialItems.filter(i => i.category === cat)
    return acc
  }, {} as Record<typeof CATEGORIES[number], NowItem[]>)

  return (
    <div style={{ padding: '32px', maxWidth: '780px' }}>

      {/* ── Add form ── */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
          Yeni Ekle
        </h2>

        <form onSubmit={handleAdd}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat]
              const active = form.category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: active ? 'none' : '1px solid #e5e7eb',
                    backgroundColor: active ? meta.color : '#ffffff',
                    color: active ? meta.text : '#6b7280',
                    fontSize: '13px',
                    fontWeight: active ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {meta.emoji} {meta.label}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
                Başlık *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Örn: Siddhartha"
                required
                style={{
                  width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
                Alt başlık / yazar
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder="Örn: Hermann Hesse"
                style={{
                  width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
              Link (opsiyonel)
            </label>
            <input
              type="url"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://"
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb',
                borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && <p style={{ fontSize: '12px', color: '#d00202', marginBottom: '12px' }}>{error}</p>}

          <button
            type="submit"
            disabled={saving || !form.title}
            style={{
              padding: '10px 24px',
              backgroundColor: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Ekleniyor…' : 'Ekle'}
          </button>
        </form>
      </div>

      {/* ── Current items by category ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat]
          const items = grouped[cat]
          if (items.length === 0) return null
          return (
            <div key={cat}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: meta.color, color: meta.text,
                padding: '4px 12px', borderRadius: '999px',
                fontSize: '12px', fontWeight: 700,
                marginBottom: '12px',
              }}>
                {meta.emoji} {meta.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      backgroundColor: '#ffffff', border: '1px solid #f0f0f0',
                      borderRadius: '10px', padding: '12px 16px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {item.url
                          ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#111827', textDecoration: 'none' }}>{item.title} ↗</a>
                          : item.title
                        }
                      </div>
                      {item.subtitle && (
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{item.subtitle}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '5px 12px', border: '1px solid #fecaca',
                        borderRadius: '6px', backgroundColor: '#fff5f5',
                        color: '#d00202', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', flexShrink: 0, marginLeft: '12px',
                      }}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {initialItems.length === 0 && (
          <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>
            Henüz hiç öğe yok. Yukarıdan ekleyebilirsin.
          </p>
        )}
      </div>
    </div>
  )
}
