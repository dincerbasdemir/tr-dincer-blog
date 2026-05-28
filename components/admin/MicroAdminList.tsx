'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

type Post = { id: string; content: string; created_at: string; pinned: boolean }

export default function MicroAdminList({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

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
      {posts.map(post => (
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

          <div
            style={{ fontSize: '14px', lineHeight: '22px', color: '#1b1c1c', margin: '0 0 12px', wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              {format(new Date(post.created_at), 'd MMM yyyy, HH:mm', { locale: tr })}
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
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
        </div>
      ))}
    </div>
  )
}
