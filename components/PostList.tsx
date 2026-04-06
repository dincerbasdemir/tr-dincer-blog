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

const PLACEHOLDER_COLORS = [
  '#e8edf5', '#f0e8f5', '#e8f5ee', '#f5ede8',
  '#eef5e8', '#f5e8f0', '#e8f2f5', '#f5f0e8',
]
function placeholderColor(title: string) {
  return PLACEHOLDER_COLORS[title.charCodeAt(0) % PLACEHOLDER_COLORS.length]
}

const PAGE_SIZE = 10

export default function PostList({
  initialPosts,
  initialOffset,
  authorName = 'Dinçer',
  authorPhoto = '',
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
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <article key={post.id}>
            <Link
              href={`/${post.slug}`}
              className="group hover:shadow-md transition-shadow duration-300"
              style={{ borderRadius: '12px', minHeight: '300px', backgroundColor: 'white', display: 'grid', gridTemplateColumns: '48% 1fr' }}
            >
              {/* Sol: Görsel — absolute fill ile tam doldurma */}
              <div style={{ position: 'relative', minHeight: '300px', borderRadius: '12px 0 0 12px', overflow: 'hidden' }}>
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none', outline: 'none', clipPath: 'inset(1px)' }}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: placeholderColor(post.title) }} />
                )}
              </div>

              {/* Sağ: İçerik */}
              <div className="flex-1 flex flex-col justify-between p-9">
                <div>
                  {/* Kategori */}
                  {post.categories?.[0] && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <svg className="w-3.5 h-3.5" style={{ color: '#A30000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#A30000' }}>
                        {post.categories[0]}
                      </span>
                    </div>
                  )}

                  {/* Başlık */}
                  <h2
                    className="group-hover:text-gray-600 transition-colors mb-4"
                    style={{ fontSize: '26px', lineHeight: '34px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p
                      style={{
                        fontSize: '15px',
                        lineHeight: '24px',
                        color: '#6b7280',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Alt: Yazar + Tarih */}
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2">
                    {authorPhoto ? (
                      <img
                        src={authorPhoto}
                        alt={authorName}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: '#1b1c1c', fontSize: '11px' }}
                      >
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{authorName}</span>
                  </div>
                  <time
                    dateTime={post.published_at}
                    style={{ fontSize: '13px', color: '#9ca3af' }}
                  >
                    {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Daha Fazla */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="font-semibold transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '999px',
              padding: '10px 32px',
              fontSize: '14px',
              color: '#374151',
              minWidth: '180px',
            }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Yükleniyor…
              </span>
            ) : (
              'Daha Fazla Yazı'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
