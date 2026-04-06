'use client'

import { useState, useRef } from 'react'

const SETTINGS_KEYS = {
  profile: [
    { key: 'author_name', label: 'Yazar Adı', type: 'text' },
    { key: 'author_title', label: 'Yazar Ünvanı', type: 'text', placeholder: 'Dijital Pazarlama Danışmanı' },
    { key: 'author_photo', label: 'Yazar Fotoğrafı', type: 'image' },
    { key: 'author_bio', label: 'Yazar Hakkında', type: 'textarea' },
  ],
  social: [
    { key: 'social_x', label: 'X (Twitter) URL', type: 'text', placeholder: 'https://x.com/...' },
    { key: 'social_website', label: 'Website URL', type: 'text', placeholder: 'https://...' },
    { key: 'social_instagram', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
    { key: 'social_youtube', label: 'YouTube URL', type: 'text', placeholder: 'https://youtube.com/...' },
    { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'https://linkedin.com/in/...' },
  ],
  site: [
    { key: 'site_tagline', label: 'Site Başlığı (Hero)', type: 'text', placeholder: 'Ağacı sev, yeşili koru, ayıyı öp.' },
    { key: 'site_description', label: 'Site Açıklaması (Alt Başlık)', type: 'textarea' },
  ],
}

export default function SiteSettings({
  initialSettings,
}: {
  initialSettings: Record<string, string>
}) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  function updateSetting(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url
  }

  async function handlePhotoUpload(file: File) {
    setUploadingPhoto(true)
    try {
      const url = await uploadImage(file)
      updateSetting('author_photo', url)
    } catch {
      setError('Fotoğraf yüklenemedi')
    }
    setUploadingPhoto(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccessMsg('')

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Bir hata oluştu')
    } else {
      setSuccessMsg('Kaydedildi!')
      setTimeout(() => setSuccessMsg(''), 2500)
    }
    setSaving(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: '24px',
  }

  const cardHeaderStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '14px',
    fontWeight: 700,
    color: '#111827',
  }

  const cardBodyStyle: React.CSSProperties = {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  }

  function renderField(field: { key: string; label: string; type: string; placeholder?: string }) {
    if (field.type === 'image') {
      const photoUrl = settings[field.key] || ''
      return (
        <div key={field.key}>
          <label style={labelStyle}>{field.label}</label>
          {photoUrl && (
            <div style={{ position: 'relative', marginBottom: '10px', display: 'inline-block' }}>
              <img
                src={photoUrl}
                alt=""
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
              />
              <button
                onClick={() => updateSetting(field.key, '')}
                style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  backgroundColor: 'rgba(0,0,0,0.55)', color: 'white',
                  border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                  cursor: 'pointer', fontSize: '11px', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >x</button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhoto}
              style={{
                padding: '8px 14px', fontSize: '12px', fontWeight: 600,
                border: '1px dashed #d1d5db', borderRadius: '6px',
                backgroundColor: 'transparent', cursor: 'pointer', color: '#6b7280',
                whiteSpace: 'nowrap',
              }}
            >
              {uploadingPhoto ? 'Yükleniyor...' : '+ Fotoğraf Yükle'}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handlePhotoUpload(f)
                e.target.value = ''
              }}
            />
            <input
              type="text"
              value={photoUrl}
              onChange={e => updateSetting(field.key, e.target.value)}
              placeholder="veya URL yapıştır"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key}>
          <label style={labelStyle}>{field.label}</label>
          <textarea
            value={settings[field.key] || ''}
            onChange={e => updateSetting(field.key, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>
      )
    }

    return (
      <div key={field.key}>
        <label style={labelStyle}>{field.label}</label>
        <input
          type="text"
          value={settings[field.key] || ''}
          onChange={e => updateSetting(field.key, e.target.value)}
          placeholder={field.placeholder || ''}
          style={inputStyle}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: '720px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
            Site Ayarları
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            Profil, sosyal medya ve site bilgilerini düzenleyin.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {successMsg && (
            <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
              {successMsg}
            </span>
          )}
          {error && (
            <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontSize: '13px', fontWeight: 700,
              backgroundColor: '#111827', color: 'white',
              border: 'none', borderRadius: '7px',
              padding: '10px 20px', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Profil Bilgileri */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>Profil Bilgileri</div>
        <div style={cardBodyStyle}>
          {SETTINGS_KEYS.profile.map(renderField)}
        </div>
      </div>

      {/* Sosyal Medya */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>Sosyal Medya Hesapları</div>
        <div style={cardBodyStyle}>
          {SETTINGS_KEYS.social.map(renderField)}
        </div>
      </div>

      {/* Site Ayarları */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>Site Ayarları</div>
        <div style={cardBodyStyle}>
          {SETTINGS_KEYS.site.map(renderField)}
        </div>
      </div>
    </div>
  )
}
