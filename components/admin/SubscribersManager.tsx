'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

type Subscriber = {
  id: string
  email: string
  active: boolean
  subscribed_at: string | null
}

export default function SubscribersManager({ initial }: { initial: Subscriber[] }) {
  const router = useRouter()
  const [subs, setSubs] = useState(initial)
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const activeSubs = subs.filter(s => s.active)
  const inactiveSubs = subs.filter(s => !s.active)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setAdding(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ type: 'error', text: data.error || 'Bir hata oluştu.' })
      } else {
        setEmail('')
        setMsg({ type: 'success', text: data.reactivated ? 'Pasif abone yeniden aktifleştirildi.' : 'Abone eklendi.' })
        setSubs(prev => {
          const rest = prev.filter(s => s.id !== data.subscriber.id)
          return [data.subscriber, ...rest]
        })
        router.refresh()
      }
    } catch {
      setMsg({ type: 'error', text: 'Bağlantı hatası.' })
    } finally {
      setAdding(false)
    }
  }

  async function toggleActive(sub: Subscriber) {
    setBusyId(sub.id)
    await fetch(`/api/admin/subscribers/${sub.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !sub.active }),
    })
    setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, active: !s.active } : s))
    setBusyId(null)
    router.refresh()
  }

  async function remove(sub: Subscriber) {
    if (!confirm(`${sub.email} adresini kalıcı olarak silmek istiyor musun?`)) return
    setBusyId(sub.id)
    await fetch(`/api/admin/subscribers/${sub.id}`, { method: 'DELETE' })
    setSubs(prev => prev.filter(s => s.id !== sub.id))
    setBusyId(null)
    router.refresh()
  }

  const btnStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 600, padding: '4px 12px',
    borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ padding: 'clamp(20px, 5vw, 36px) clamp(16px, 5vw, 40px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
            Aboneler
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            {activeSubs.length} aktif · {inactiveSubs.length} pasif · toplam {subs.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '14px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center', minWidth: '90px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{activeSubs.length}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Aktif</div>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '14px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center', minWidth: '90px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#9ca3af', lineHeight: 1 }}>{inactiveSubs.length}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Pasif</div>
          </div>
        </div>
      </div>

      {/* Ekleme formu */}
      <form onSubmit={handleAdd} style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '18px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px',
      }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '8px' }}>
          Manuel abone ekle
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setMsg(null) }}
            placeholder="ornek@email.com"
            style={{
              flex: '1 1 220px', padding: '10px 14px', border: '1px solid #e5e7eb',
              borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={adding || !email.trim()}
            style={{
              padding: '10px 22px', backgroundColor: '#111827', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
              cursor: adding || !email.trim() ? 'not-allowed' : 'pointer',
              opacity: adding || !email.trim() ? 0.6 : 1, whiteSpace: 'nowrap',
            }}
          >
            {adding ? 'Ekleniyor…' : 'Ekle'}
          </button>
        </div>
        {msg && (
          <p style={{ fontSize: '13px', margin: '10px 0 0', color: msg.type === 'error' ? '#d00202' : '#16a34a', fontWeight: 500 }}>
            {msg.type === 'success' ? '✓ ' : ''}{msg.text}
          </p>
        )}
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '10px 0 0' }}>
          Manuel eklenen aboneye hoş geldin maili gönderilmez.
        </p>
      </form>

      {/* Tablo */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {subs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '14px', margin: 0 }}>Henüz abone yok.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['E-posta', 'Durum', 'Abone Tarihi', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '12px 20px', textAlign: i === 3 ? 'right' : 'left',
                      fontSize: '11px', fontWeight: 700, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((sub, i) => (
                  <tr key={sub.id} style={{ borderBottom: i < subs.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{sub.email}</div>
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                        backgroundColor: sub.active ? '#f0fdf4' : '#f9fafb',
                        color: sub.active ? '#16a34a' : '#9ca3af',
                      }}>
                        {sub.active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {sub.subscribed_at ? format(new Date(sub.subscribed_at), 'd MMM yyyy, HH:mm', { locale: tr }) : '—'}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => toggleActive(sub)}
                          disabled={busyId === sub.id}
                          style={{ ...btnStyle, border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#6b7280' }}
                        >
                          {sub.active ? 'Pasifleştir' : 'Aktifleştir'}
                        </button>
                        <button
                          onClick={() => remove(sub)}
                          disabled={busyId === sub.id}
                          style={{ ...btnStyle, border: '1px solid #fecaca', backgroundColor: '#fff', color: '#dc2626' }}
                        >
                          {busyId === sub.id ? '…' : 'Sil'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
