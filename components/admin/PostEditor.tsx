'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { turkishSlugify, calcReadingTime } from '@/lib/utils'

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false })

type Category = { id: string; name: string; slug: string }

interface PostData {
  id?: string
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  categories?: string[]
  tags?: string[]
  status?: string
  published_at?: string
  featured_image?: string
  meta_description?: string
  reading_time?: string
}

export default function PostEditor({
  post,
  categories,
}: {
  post?: PostData
  categories: Category[]
}) {
  const router = useRouter()
  const isEditing = !!post?.id
  const featuredImageInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [selectedCats, setSelectedCats] = useState<string[]>(post?.categories || [])
  const [tags, setTags] = useState((post?.tags || []).join(', '))
  const [status, setStatus] = useState(post?.status || 'published')
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at
      ? new Date(post.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  )
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '')
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [uploadingFeatured, setUploadingFeatured] = useState(false)

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

  function toggleCategory(name: string) {
    setSelectedCats(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    )
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url
  }

  async function handleFeaturedUpload(file: File) {
    setUploadingFeatured(true)
    try {
      const url = await uploadImage(file)
      setFeaturedImage(url)
    } catch {
      setError('Görsel yüklenemedi')
    }
    setUploadingFeatured(false)
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
      excerpt: excerpt.trim() || null,
      categories: selectedCats,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
      published_at: new Date(publishedAt).toISOString(),
      featured_image: featuredImage || null,
      meta_description: metaDescription.trim() || null,
      reading_time: calcReadingTime(content),
    }

    const url = isEditing ? `/api/admin/posts/${post!.id}` : '/api/admin/posts'
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
        router.push(`/admin/posts/${data.id}/edit`)
      }
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!isEditing) return
    if (!confirm(`"${title}" yazısını silmek istediğinizden emin misiniz?`)) return
    setDeleting(true)
    const res = await fetch(`/api/admin/posts/${post!.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Silinemedi')
      setDeleting(false)
    }
  }

  const sidebarInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  }

  const sidebarLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  }

  const sidebarSectionStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid #f3f4f6',
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
            onClick={() => router.push('/admin')}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '13px', color: '#6b7280', padding: '4px 0',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            ← Yazılar
          </button>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
            {isEditing ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {successMsg && (
            <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
              ✓ {successMsg}
            </span>
          )}
          {error && (
            <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
          )}
          {isEditing && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px', color: '#6b7280', textDecoration: 'none',
                padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '7px',
              }}
            >
              ↗ Gör
            </a>
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
              {deleting ? '…' : 'Sil'}
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
            {saving ? 'Kaydediliyor…' : (isEditing ? 'Kaydet' : 'Yayınla')}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Editor area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Başlık"
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

        {/* Right sidebar */}
        <aside style={{
          width: '280px',
          flexShrink: 0,
          backgroundColor: 'white',
          borderLeft: '1px solid #e5e7eb',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Status & Date */}
          <div style={sidebarSectionStyle}>
            <label style={sidebarLabelStyle}>Durum</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ ...sidebarInputStyle, marginBottom: '12px' }}
            >
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>

            <label style={sidebarLabelStyle}>Yayın Tarihi</label>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={e => setPublishedAt(e.target.value)}
              style={sidebarInputStyle}
            />
          </div>

          {/* Featured image */}
          <div style={sidebarSectionStyle}>
            <label style={sidebarLabelStyle}>Öne Çıkan Görsel</label>
            {featuredImage && (
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <img
                  src={featuredImage}
                  alt=""
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '6px' }}
                />
                <button
                  onClick={() => setFeaturedImage('')}
                  style={{
                    position: 'absolute', top: '6px', right: '6px',
                    backgroundColor: 'rgba(0,0,0,0.55)', color: 'white',
                    border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                    cursor: 'pointer', fontSize: '12px', lineHeight: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              </div>
            )}
            <button
              onClick={() => featuredImageInputRef.current?.click()}
              disabled={uploadingFeatured}
              style={{
                width: '100%', padding: '8px', fontSize: '12px', fontWeight: 600,
                border: '1px dashed #d1d5db', borderRadius: '6px',
                backgroundColor: 'transparent', cursor: 'pointer', color: '#6b7280',
                marginBottom: '8px',
              }}
            >
              {uploadingFeatured ? 'Yükleniyor…' : '+ Görsel Yükle'}
            </button>
            <input
              ref={featuredImageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFeaturedUpload(f)
                e.target.value = ''
              }}
            />
            <input
              type="text"
              value={featuredImage}
              onChange={e => setFeaturedImage(e.target.value)}
              placeholder="veya URL yapıştır"
              style={sidebarInputStyle}
            />
          </div>

          {/* Excerpt */}
          <div style={sidebarSectionStyle}>
            <label style={sidebarLabelStyle}>Özet (Excerpt)</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Kısa açıklama…"
              rows={3}
              style={{ ...sidebarInputStyle, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          {/* Categories */}
          <div style={sidebarSectionStyle}>
            <label style={sidebarLabelStyle}>Kategoriler</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {categories.map(cat => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                    style={{ width: '14px', height: '14px', accentColor: '#111827' }}
                  />
                  <span style={{ fontSize: '13px', color: '#374151' }}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={sidebarSectionStyle}>
            <label style={sidebarLabelStyle}>Etiketler</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="etiket1, etiket2, etiket3"
              style={sidebarInputStyle}
            />
            <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '5px', margin: '5px 0 0' }}>
              Virgülle ayırın
            </p>
          </div>

          {/* SEO */}
          <div style={sidebarSectionStyle}>
            <label style={{ ...sidebarLabelStyle, color: '#870500' }}>SEO</label>

            <label style={sidebarLabelStyle}>Meta Başlık</label>
            <input
              type="text"
              value={title}
              readOnly
              style={{ ...sidebarInputStyle, marginBottom: '10px', backgroundColor: '#f9fafb', color: '#9ca3af' }}
            />

            <label style={sidebarLabelStyle}>Meta Açıklama</label>
            <textarea
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder={excerpt || 'Meta description…'}
              rows={3}
              maxLength={160}
              style={{ ...sidebarInputStyle, resize: 'vertical', lineHeight: 1.5 }}
            />
            <p style={{ fontSize: '11px', color: metaDescription.length > 140 ? '#f59e0b' : '#9ca3af', marginTop: '4px', margin: '4px 0 0' }}>
              {metaDescription.length}/160 karakter
            </p>
          </div>

        </aside>
      </div>
    </div>
  )
}
