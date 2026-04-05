'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'

export type Post = {
  id: string
  title: string
  slug: string
  published_at: string
  categories?: string[]
  reading_time?: string
  featured_image?: string
}

const PLACEHOLDER_COLORS = [
  '#f0ece6', '#e6edf0', '#ebe6f0', '#e6f0ec',
  '#f0e9e6', '#ecf0e6', '#f0e6ea', '#e6eff0',
]
function placeholderColor(title: string) {
  return PLACEHOLDER_COLORS[title.charCodeAt(0) % PLACEHOLDER_COLORS.length]
}

const PAGE_SIZE = 10

export default function PostList({
  initialPosts,
  initialOffset,
}: {
  initialPosts: Post[]
  initialOffset: number
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
      .select('id, title, slug, published_at, categories, reading_time, featured_image')
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
      {/* Liste */}
      <div>
        {posts.map((post, i) => (
          <article key={post.id}>
            <Link href={`/${post.slug}`} className="group flex items-center justify-between gap-6 py-5 hover:opacity-80 transition-opacity">
              {/* Sol: meta + başlık */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5" style={{ fontSize: '12px', color: '#9ca3af' }}>
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), 'd MMM, yyyy', { locale: tr })}
                  </time>
                  {post.categories?.[0] && (
                    <><span>·</span><span style={{ color: '#9ca3af' }}>#{post.categories[0]}</span></>
                  )}
                </div>
                <h3
                  className="text-gray-900 leading-snug"
                  style={{ fontSize: '16px', fontWeight: 700, lineHeight: '22px' }}
                >
                  {post.title}
                </h3>
              </div>

              {/* Sağ: küçük kare thumbnail */}
              {post.featured_image ? (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="flex-shrink-0 object-cover rounded-sm"
                  style={{ width: '72px', height: '54px' }}
                />
              ) : (
                <div
                  className="flex-shrink-0 rounded-sm"
                  style={{
                    width: '72px',
                    height: '54px',
                    backgroundColor: placeholderColor(post.title),
                  }}
                />
              )}
            </Link>
            {/* Ayırıcı — son item hariç */}
            {i < posts.length - 1 && (
              <div style={{ height: '1px', backgroundColor: '#f3f4f6' }} />
            )}
          </article>
        ))}
      </div>

      {/* Daha Fazla butonu */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all disabled:opacity-50"
            style={{ borderRadius: '2px', minWidth: '180px' }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                Yükleniyor
              </span>
            ) : (
              'Daha Fazla'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
