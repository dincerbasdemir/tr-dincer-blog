'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Search error:', error)
        setResults([])
      } else {
        setResults(data || [])
      }

      setLoading(false)
    }

    search()
  }, [query])

  return (
    <>
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Arama Sonuçları
        </h1>
        {query && (
          <p className="text-gray-600">
            &ldquo;<span className="font-medium">{query}</span>&rdquo; için {results.length} sonuç bulundu
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {query ? 'Aramanızla eşleşen sonuç bulunamadı.' : 'Arama yapmak için bir terim girin.'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {results.map((post) => (
            <article key={post.id} className="fade-in">
              <Link href={`/${post.slug}`} className="group">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h2>
              </Link>

              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
                </time>
                {post.reading_time && (
                  <>
                    <span>•</span>
                    <span>{post.reading_time}</span>
                  </>
                )}
                {post.categories && post.categories.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{post.categories[0]}</span>
                  </>
                )}
              </div>

              {post.excerpt && (
                <p className="text-gray-600 leading-relaxed mb-3">
                  {post.excerpt}
                </p>
              )}

              <Link
                href={`/${post.slug}`}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Devamını oku
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Suspense fallback={
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  )
}
