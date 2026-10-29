'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatDuration, audioPublicUrl, coverUrl } from '@/lib/audio'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

type Episode = {
  id: string
  title: string
  description: string | null
  audio_path: string
  duration: number | null
  file_size: number | null
  post_slug: string | null
  published: boolean
  plays: number
  created_at: string
}

// Dosyanın süresini tarayıcıda oku
function readDuration(file: File): Promise<number> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file)
    const a = document.createElement('audio')
    a.preload = 'metadata'
    a.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(a.duration || 0) }
    a.onerror = () => { URL.revokeObjectURL(url); resolve(0) }
    a.src = url
  })
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}

export default function AudioManager({ initial, initialCover }: { initial: Episode[]; initialCover: string }) {
  const router = useRouter()
  const [episodes, setEpisodes] = useState(initial)

  /* ── Kapak ── */
  const [cover, setCover] = useState(initialCover)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverMsg, setCoverMsg] = useState('')

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setCoverUploading(true)
    setCoverMsg('')
    try {
      const r1 = await fetch('/api/admin/audio/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `kapak-${f.name}` }),
      })
      const d1 = await r1.json()
      if (!r1.ok) throw new Error(d1.error)
      const { error: upErr } = await supabase.storage.from('audio').uploadToSignedUrl(d1.path, d1.token, f)
      if (upErr) throw upErr
      const url = audioPublicUrl(d1.path)
      const r2 = await fetch('/api/admin/podcast-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cover: url }),
      })
      if (!r2.ok) throw new Error('Kapak kaydedilemedi.')
      setCover(url)
      router.refresh()
    } catch (err: any) {
      setCoverMsg(err.message || 'Kapak yüklenemedi.')
    } finally {
      setCoverUploading(false)
      e.target.value = ''
    }
  }

  async function resetCover() {
    if (!confirm('Varsayılan kapağa dönülsün mü?')) return
    await fetch('/api/admin/podcast-cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cover: '' }),
    })
    setCover('')
    router.refresh()
  }

  /* ── Yükleme formu ── */
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [postSlug, setPostSlug] = useState('')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title.trim()) return
    setUploading(true)
    setMsg(null)
    try {
      const duration = Math.round(await readDuration(file))

      // 1) İmzalı URL al
      const r1 = await fetch('/api/admin/audio/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name }),
      })
      const d1 = await r1.json()
      if (!r1.ok) throw new Error(d1.error || 'İmzalı URL alınamadı.')

      // 2) Dosyayı doğrudan Supabase'e yükle
      const { error: upErr } = await supabase.storage
        .from('audio')
        .uploadToSignedUrl(d1.path, d1.token, file)
      if (upErr) throw upErr

      // 3) Kaydı oluştur
      const r2 = await fetch('/api/admin/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description, audio_path: d1.path,
          duration, file_size: file.size, post_slug: postSlug,
        }),
      })
      const d2 = await r2.json()
      if (!r2.ok) throw new Error(d2.error || 'Kayıt oluşturulamadı.')

      setEpisodes(prev => [d2.episode, ...prev])
      setFile(null); setTitle(''); setDescription(''); setPostSlug('')
      // dosya input'unu sıfırla
      const input = document.getElementById('audio-file-input') as HTMLInputElement | null
      if (input) input.value = ''
      setMsg({ type: 'success', text: 'Bölüm yüklendi.' })
      router.refresh()
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Yükleme sırasında hata oluştu.' })
    } finally {
      setUploading(false)
    }
  }

  /* ── Düzenleme ── */
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', post_slug: '' })
  const [busyId, setBusyId] = useState<string | null>(null)

  function startEdit(ep: Episode) {
    setEditingId(ep.id)
    setEditForm({ title: ep.title, description: ep.description || '', post_slug: ep.post_slug || '' })
  }

  async function saveEdit(id: string) {
    setBusyId(id)
    await fetch(`/api/admin/audio/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    setEpisodes(prev => prev.map(e => e.id === id ? { ...e, title: editForm.title.trim(), description: editForm.description.trim() || null, post_slug: editForm.post_slug.trim() || null } : e))
    setEditingId(null)
    setBusyId(null)
    router.refresh()
  }

  async function togglePublished(ep: Episode) {
    setBusyId(ep.id)
    await fetch(`/api/admin/audio/${ep.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !ep.published }),
    })
    setEpisodes(prev => prev.map(e => e.id === ep.id ? { ...e, published: !e.published } : e))
    setBusyId(null)
    router.refresh()
  }

  async function remove(ep: Episode) {
    if (!confirm(`"${ep.title}" bölümünü ve ses dosyasını kalıcı olarak silmek istiyor musun?`)) return
    setBusyId(ep.id)
    await fetch(`/api/admin/audio/${ep.id}`, { method: 'DELETE' })
    setEpisodes(prev => prev.filter(e => e.id !== ep.id))
    setBusyId(null)
    router.refresh()
  }

  const [notifyingId, setNotifyingId] = useState<string | null>(null)

  async function notifySubscribers(ep: Episode) {
    if (!ep.published) { alert('Önce bölümü yayınla.'); return }
    if (!confirm(`"${ep.title}" bölümü tüm e-posta abonelerine gönderilsin mi?`)) return
    setNotifyingId(ep.id)
    try {
      const res = await fetch(`/api/admin/audio/${ep.id}/notify`, { method: 'POST' })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Gönderilemedi.')
      alert(d.sent === 0 ? 'Aktif abone yok.' : `${d.sent} aboneye gönderildi${d.failed ? `, ${d.failed} başarısız` : ''}.`)
    } catch (err: any) {
      alert('Hata: ' + (err.message || 'Gönderilemedi.'))
    } finally {
      setNotifyingId(null)
    }
  }

  const btn: React.CSSProperties = {
    fontSize: '12px', fontWeight: 600, padding: '4px 12px',
    borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ padding: 'clamp(20px, 5vw, 36px) clamp(16px, 5vw, 40px)', maxWidth: '780px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Ses
        </h1>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          {episodes.length} bölüm · <a href="/ses" target="_blank" style={{ color: '#d00202', textDecoration: 'none' }}>/ses sayfasında</a> görünür
        </p>
      </div>

      {/* Kapak */}
      <div style={{
        backgroundColor: '#ffffff', border: '1px solid #f0f0f0',
        borderRadius: '12px', padding: '20px 24px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '18px',
      }}>
        <img
          src={coverUrl(cover)}
          alt="Podcast kapağı"
          style={{ width: '84px', height: '84px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>
            Kapak
          </h2>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 10px' }}>
            Tüm bölümlerin yanında görünür. {cover ? 'Kendi kapağın yüklü.' : 'Şu an varsayılan kapak kullanılıyor.'} Kare görsel (ör. 1400×1400) öner.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{
              fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '6px',
              border: 'none', backgroundColor: '#111827', color: '#fff',
              cursor: coverUploading ? 'not-allowed' : 'pointer', opacity: coverUploading ? 0.6 : 1,
            }}>
              {coverUploading ? 'Yükleniyor…' : (cover ? 'Değiştir' : 'Kapak Yükle')}
              <input type="file" accept="image/*" onChange={handleCoverChange} disabled={coverUploading} style={{ display: 'none' }} />
            </label>
            {cover && (
              <button onClick={resetCover} type="button" style={{
                fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '6px',
                border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#6b7280', cursor: 'pointer',
              }}>
                Varsayılana dön
              </button>
            )}
          </div>
          {coverMsg && <p style={{ fontSize: '12px', color: '#d00202', margin: '8px 0 0' }}>{coverMsg}</p>}
        </div>
      </div>

      {/* Yükleme formu */}
      <form onSubmit={handleUpload} style={{
        backgroundColor: '#ffffff', border: '1px solid #f0f0f0',
        borderRadius: '12px', padding: '24px', marginBottom: '28px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
          Yeni Bölüm
        </h2>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
            Ses dosyası (MP3) *
          </label>
          <input
            id="audio-file-input"
            type="file"
            accept="audio/*"
            onChange={e => { setFile(e.target.files?.[0] || null); setMsg(null) }}
            style={{ fontSize: '13px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
            Başlık *
          </label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Bölüm başlığı" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
            Açıklama
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            placeholder="Kısa açıklama (opsiyonel)" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
            Yazı slug'ı (opsiyonel — bir yazının sesli versiyonuysa)
          </label>
          <input type="text" value={postSlug} onChange={e => setPostSlug(e.target.value)}
            placeholder="ornek-yazi-slug" style={inputStyle} />
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0' }}>
            Doldurursan o yazının başında «Bu yazıyı dinle» oynatıcısı çıkar.
          </p>
        </div>

        {msg && (
          <p style={{ fontSize: '13px', margin: '0 0 12px', fontWeight: 500, color: msg.type === 'error' ? '#d00202' : '#16a34a' }}>
            {msg.type === 'success' ? '✓ ' : ''}{msg.text}
          </p>
        )}

        <button type="submit" disabled={uploading || !file || !title.trim()}
          style={{
            padding: '10px 24px', backgroundColor: '#111827', color: '#fff',
            border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
            cursor: uploading || !file || !title.trim() ? 'not-allowed' : 'pointer',
            opacity: uploading || !file || !title.trim() ? 0.6 : 1,
          }}>
          {uploading ? 'Yükleniyor…' : 'Yükle'}
        </button>
      </form>

      {/* Liste */}
      {episodes.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>
          Henüz bölüm yok. Yukarıdan yükleyebilirsin.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {episodes.map(ep => (
            <div key={ep.id} style={{
              backgroundColor: '#ffffff', border: '1px solid #f0f0f0',
              borderRadius: '10px', padding: '14px 18px',
            }}>
              {editingId === ep.id ? (
                /* ── Düzenleme ── */
                <div>
                  <input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Başlık" style={{ ...inputStyle, marginBottom: '8px' }} />
                  <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    rows={2} placeholder="Açıklama" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', marginBottom: '8px' }} />
                  <input type="text" value={editForm.post_slug} onChange={e => setEditForm(f => ({ ...f, post_slug: e.target.value }))}
                    placeholder="Yazı slug'ı" style={{ ...inputStyle, marginBottom: '10px' }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => saveEdit(ep.id)} disabled={busyId === ep.id}
                      style={{ ...btn, border: 'none', backgroundColor: '#111827', color: '#fff' }}>
                      {busyId === ep.id ? 'Kaydediliyor…' : 'Kaydet'}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      style={{ ...btn, border: 'none', backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Görünüm ── */
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{ep.title}</span>
                      {!ep.published && (
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', backgroundColor: '#f3f4f6', borderRadius: '999px', padding: '1px 8px' }}>Gizli</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {format(new Date(ep.created_at), 'd MMM yyyy', { locale: tr })}
                      {ep.duration ? ` · ${formatDuration(ep.duration)}` : ''}
                      {` · ▶ ${ep.plays} dinlenme`}
                      {ep.post_slug ? ` · 🔗 ${ep.post_slug}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button onClick={() => notifySubscribers(ep)} disabled={notifyingId === ep.id}
                      style={{ ...btn, border: '1px solid #fecaca', backgroundColor: '#fff5f5', color: '#d00202' }}>
                      {notifyingId === ep.id ? 'Gönderiliyor…' : 'Abonelere Gönder'}
                    </button>
                    <button onClick={() => togglePublished(ep)} disabled={busyId === ep.id}
                      style={{ ...btn, border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#6b7280' }}>
                      {ep.published ? 'Gizle' : 'Yayınla'}
                    </button>
                    <button onClick={() => startEdit(ep)}
                      style={{ ...btn, border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151' }}>
                      Düzenle
                    </button>
                    <button onClick={() => remove(ep)} disabled={busyId === ep.id}
                      style={{ ...btn, border: '1px solid #fecaca', backgroundColor: '#fff', color: '#dc2626' }}>
                      {busyId === ep.id ? '…' : 'Sil'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
