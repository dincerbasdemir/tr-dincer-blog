'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'

export type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string
  published_at: string
  categories?: string[]
  reading_time?: string
  featured_image?: string
}

const PAGE_SIZE = 10

export default function PostList({
  initialPosts,
  initialOffset,
}: {
  initialPosts: Post[]
  initialOffset: number
  authorName?: string
  authorPhoto?: string
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length === PAGE_SIZE)
  const offsetRef = useRef(initialOffset)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const from = offsetRef.current
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, published_at, categories, reading_time, featured_image')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)
    if (!error && data) {
      setPosts((prev) => [...prev, ...data])
      offsetRef.current = from + data.length
      setHasMore(data.length === PAGE_SIZE)
    }
    setLoading(false)
  }, [loading, hasMore])

  return (
    <div>
      {posts.map((post, index) => (
        <article key={post.id} style={{ borderTop: index === 0 ? 'none' : '1px solid #f0f0f0' }}>
          <Link
            href={`/${post.slug}`}
            style={{ display: 'block', padding: '32px 0', textDecoration: 'none' }}
            className="group"
          >
            {/* Tarih + Kategoriler */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <time
                dateTime={post.published_at}
                style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#adb5bd' }}
              >
                {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
              </time>
              {post.categories?.map((cat) => (
                <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#d1d5db', fontSize: '11px' }}>•</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#adb5bd' }}>
                    {cat}
                  </span>
                </span>
              ))}
            </div>

            {/* Başlık */}
            <h2
              className="group-hover:opacity-70 transition-opacity"
              style={{ fontSize: '22px', lineHeight: '30px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', marginBottom: '10px' }}
            >
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p style={{ fontSize: '15px', lineHeight: '24px', color: '#111827', margin: 0 }}>
                {post.excerpt}
              </p>
            )}
          </Link>
        </article>
      ))}

      {/* Daha Fazla */}
      {hasMore && (
        <div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
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
            {loading ? 'Yükleniyor…' : 'Daha Fazla Yazı →'}
          </button>
        </div>
      )}
    </div>
  )
}
