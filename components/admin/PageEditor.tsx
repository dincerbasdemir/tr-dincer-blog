'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { turkishSlugify } from '@/lib/utils'

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false })

interface PageData {
  id: string
  title: string
  slug: string
  content: string
}

export default function PageEditor({ page }: { page?: PageData }) {
  const router = useRouter()
  const isEditing = !!page?.id

  const [title, setTitle] = useState(page?.title || '')
  const [slug, setSlug] = useState(page?.slug || '')
  const [content, setContent] = useState(page?.content || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugManuallyEdited) {
      setSlug(turkishSlugify(val))
    }
  }

  function handleSlugChange(val: string) {
    setSlugManuallyEdited(true)
    setSlug(val)
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url
  }

  async function handleSave() {
    if (!title.trim()) { setError('Başlık zorunludur'); return }
    if (!slug.trim()) { setError('Slug zorunludur'); return }

    setSaving(true)
    setError('')
    setSuccessMsg('')

    const body = {
      title: title.trim(),
      slug: slug.trim(),
      content,
    }

    const url = isEditing ? `/api/admin/pages/${page!.id}` : '/api/admin/pages'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Bir hata oluştu')
    } else {
      setSuccessMsg('Kaydedildi!')
      setTimeout(() => setSuccessMsg(''), 2500)
      if (!isEditing && data.id) {
        router.push(`/admin/pages/${data.id}/edit`)
      }
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!isEditing) return
    if (!confirm(`"${title}" sayfasını silmek istediğinizden emin misiniz?`)) return
    setDeleting(true)
    const res = await fetch(`/api/admin/pages/${page!.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/pages')
    } else {
      setError('Silinemedi')
      setDeleting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => router.push('/admin/pages')}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '13px', color: '#6b7280', padding: '4px 0',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            ← Sayfalar
          </button>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
            {isEditing ? 'Sayfayı Düzenle' : 'Yeni Sayfa'}
          </h1>
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
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                fontSize: '13px', color: '#dc2626', backgroundColor: 'transparent',
                border: '1px solid #fecaca', borderRadius: '7px',
                padding: '8px 14px', cursor: 'pointer',
              }}
            >
              {deleting ? '...' : 'Sil'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontSize: '13px', fontWeight: 700,
              backgroundColor: '#111827', color: 'white',
              border: 'none', borderRadius: '7px',
              padding: '8px 20px', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Kaydediliyor...' : (isEditing ? 'Kaydet' : 'Oluştur')}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder="Sayfa Başlığı"
          style={{
            width: '100%',
            fontSize: '32px',
            fontWeight: 800,
            color: '#111827',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            marginBottom: '10px',
            letterSpacing: '-0.02em',
          }}
        />

        {/* Slug */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>tr.dincer.co/</span>
          <input
            type="text"
            value={slug}
            onChange={e => handleSlugChange(e.target.value)}
            style={{
              fontSize: '12px',
              color: '#6b7280',
              border: 'none',
              outline: 'none',
              backgroundColor: '#f3f4f6',
              padding: '3px 8px',
              borderRadius: '4px',
              minWidth: '200px',
            }}
          />
        </div>

        {/* Rich editor */}
        <RichEditor
          content={content}
          onChange={setContent}
          onImageUpload={uploadImage}
        />
      </div>
    </div>
  )
}
