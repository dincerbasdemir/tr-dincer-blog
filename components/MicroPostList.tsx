'use client'

import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import MicroPostCard from '@/components/MicroPostCard'

type MicroPost = { id: string; content: string; created_at: string; pinned: boolean }

const PAGE_SIZE = 20

export default function MicroPostList({
  initialPosts,
  initialHasMore,
}: {
  initialPosts: MicroPost[]
  initialHasMore: boolean
}) {
  const [posts, setPosts] = useState<MicroPost[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const offsetRef = useRef(initialPosts.length)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const from = offsetRef.current
    const { data, error } = await supabase
      .from('micro_posts')
      .select('id, content, created_at, pinned')
      .eq('pinned', false) // sabitlenmiş olanlar zaten başta yüklendi
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (!error && data) {
      setPosts(prev => [...prev, ...data])
      offsetRef.current = from + data.length
      setHasMore(data.length === PAGE_SIZE)
    }
    setLoading(false)
  }, [loading, hasMore])

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>💭</div>
        <p style={{ fontSize: '14px', margin: 0 }}>Henüz mikro yazı yok.</p>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map(post => (
          <MicroPostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0', marginTop: '16px' }}>
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              fontSize: '13px',
              fontWeight: 600,
              color: '#9ca3af',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {loading ? 'Yükleniyor…' : 'Daha Fazla →'}
          </button>
        </div>
      )}
    </div>
  )
}
