'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import dynamic from 'next/dynamic'

const MicroEditor = dynamic(() => import('./MicroEditor'), { ssr: false })

type Post = { id: string; content: string; created_at: string; pinned: boolean }

const MAX_CHARS = 5000

export default function MicroAdminList({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Sunucu refresh olunca listeyi güncelle
  useEffect(() => { setPosts(initial) }, [initial])

  function startEdit(post: Post) {
    setEditingId(post.id)
    setEditContent(post.content)
    setEditError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditContent('')
    setEditError('')
  }

  const editPlainText = editContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
  const editRemaining = MAX_CHARS - editPlainText.length
  const editOverLimit = editRemaining < 0

  async function handleEditSave(id: string) {
    if (!editContent.trim() || editOverLimit) return
    setEditSaving(true)
    setEditError('')
    try {
      const res = await fetch(`/api/admin/micro/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Hata')
      }
      setPosts(p => p.map(x => x.id === id ? { ...x, content: editContent.trim() } : x))
      cancelEdit()
      router.refresh()
    } catch (err: any) {
      setEditError(err.message || 'Bir hata oluştu.')
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu mikro yazıyı silmek istiyor musun?')) return
    setLoadingId(id)
    await fetch(`/api/admin/micro/${id}`, { method: 'DELETE' })
    setPosts(p => p.filter(x => x.id !== id))
    setLoadingId(null)
    router.refresh()
  }

  async function handlePin(post: Post) {
    setLoadingId(post.id)
    await fetch(`/api/admin/micro/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: !post.pinned }),
    })
    setPosts(p => p.map(x => x.id === post.id ? { ...x, pinned: !x.pinned } : x))
    setLoadingId(null)
    router.refresh()
  }

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>💭</div>
        <p style={{ fontSize: '14px', margin: 0 }}>Henüz mikro yazı yok.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {posts.map(post => {
        const isEditing = editingId === post.id
        return (
          <div
            key={post.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: post.pinned ? '1px solid rgba(208,2,2,0.2)' : '1px solid #f0f0f0',
              padding: '16px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {post.pinned && (
              <span style={{
                display: 'inline-block', marginBottom: '6px',
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.07em', color: '#d00202',
              }}>
                📌 Sabitlenmiş
              </span>
            )}

            {isEditing ? (
              /* ── Edit mode ── */
              <div>
                <MicroEditor content={editContent} onChange={setEditContent} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: editOverLimit ? '#d00202' : editRemaining < 200 ? '#f59e0b' : '#9ca3af',
                    fontWeight: editOverLimit ? 700 : 400,
                  }}>
                    {editRemaining}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleEditSave(post.id)}
                      disabled={editSaving || !editContent.trim() || editOverLimit}
                      style={{
                        fontSize: '12px', fontWeight: 700, padding: '5px 16px',
                        border: 'none', borderRadius: '6px',
                        backgroundColor: '#111827', color: '#fff',
                        cursor: editSaving || !editContent.trim() || editOverLimit ? 'not-allowed' : 'pointer',
                        opacity: editSaving || !editContent.trim() || editOverLimit ? 0.6 : 1,
                      }}
                    >
                      {editSaving ? 'Kaydediliyor…' : 'Kaydet'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        fontSize: '12px', fontWeight: 600, padding: '5px 16px',
                        border: 'none', borderRadius: '6px',
                        backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'pointer',
                      }}
                    >
                      İptal
                    </button>
                  </div>
                </div>
                {editError && (
                  <p style={{ fontSize: '12px', color: '#d00202', margin: '8px 0 0' }}>{editError}</p>
                )}
              </div>
            ) : (
              /* ── View mode ── */
              <>
                <div
                  className="micro-admin-content"
                  style={{ fontSize: '14px', lineHeight: '22px', color: '#1b1c1c', margin: '0 0 12px', wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {format(new Date(post.created_at), 'd MMM yyyy, HH:mm', { locale: tr })}
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => startEdit(post)}
                      disabled={loadingId === post.id}
                      style={{
                        fontSize: '12px', fontWeight: 600,
                        padding: '4px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                        cursor: 'pointer',
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handlePin(post)}
                      disabled={loadingId === post.id}
                      style={{
                        fontSize: '12px', fontWeight: 600,
                        padding: '4px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: post.pinned ? '#fef2f2' : '#fff',
                        color: post.pinned ? '#d00202' : '#6b7280',
                        cursor: 'pointer',
                      }}
                    >
                      {post.pinned ? 'Sabiti Kaldır' : 'Sabitle'}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={loadingId === post.id}
                      style={{
                        fontSize: '12px', fontWeight: 600,
                        padding: '4px 12px',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        backgroundColor: '#fff',
                        color: '#dc2626',
                        cursor: 'pointer',
                      }}
                    >
                      {loadingId === post.id ? '…' : 'Sil'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )
      })}

      <style>{`.micro-admin-content a { color: #d00202; text-decoration: none; }`}</style>
    </div>
  )
}
