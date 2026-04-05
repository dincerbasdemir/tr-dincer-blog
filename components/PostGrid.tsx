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
  excerpt?: string
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

export default function PostGrid({
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
  const triggerRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const from = offsetRef.current
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, published_at, categories, reading_time, featured_image')
      .order('published_at', { ascending: false })
      .range(from, to)

    if (!error && data) {
      setPosts((prev) => [...prev, ...data])
      offsetRef.current = from + data.length
      setHasMore(data.length === PAGE_SIZE)
    }

    setLoading(false)
  }, [loading, hasMore])

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <article key={post.id}>
            <Link
              href={`/${post.slug}`}
              className="group flex gap-5 items-start bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-5"
            >
              {/* Thumbnail */}
              {post.featured_image ? (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-40 h-[112px] object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div
                  className="w-40 h-[112px] rounded-lg flex-shrink-0"
                  style={{ backgroundColor: placeholderColor(post.title) }}
                />
              )}

              {/* Text */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-[112px]">
                <h3
                  className="font-semibold text-gray-900 group-hover:text-gray-500 transition-colors line-clamp-3"
                  style={{ fontSize: '23px', lineHeight: '30px' }}
                >
                  {post.title}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), 'd MMM yyyy', { locale: tr })}
                  </time>
                  {post.reading_time && <><span>·</span><span>{post.reading_time}</span></>}
                  {post.categories?.[0] && <><span>·</span><span>{post.categories[0]}</span></>}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Scroll trigger */}
      <div ref={triggerRef} className="mt-10 flex justify-center h-8">
        {loading && (
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        )}
      </div>
    </>
  )
}
