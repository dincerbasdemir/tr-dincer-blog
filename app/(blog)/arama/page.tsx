'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(query)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setInputValue(query)
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    async function search() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, published_at, reading_time, categories')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(20)
      setResults(error ? [] : data || [])
      setLoading(false)
    }
    search()
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (inputValue.trim()) {
      router.push(`/arama?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }

  return (
    <div style={{ backgroundColor: '#fbf9f8', minHeight: '100vh' }}>
      <div className="max-w-[740px] mx-auto px-5 pt-14 pb-24">

        {/* Başlık */}
        <h1 style={{
          fontSize: '45px',
          lineHeight: '54px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#1b1c1c',
          marginBottom: '32px',
        }}>
          Arama
        </h1>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '48px' }}>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Yazılarda ara…"
              style={{
                width: '100%',
                padding: '14px 52px 14px 20px',
                fontSize: '17px',
                fontFamily: 'inherit',
                color: '#1b1c1c',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* Sonuçlar */}
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: '48px' }}>
            <div className="inline-block w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
          </div>
        ) : query && results.length === 0 ? (
          <p style={{ fontSize: '16px', color: '#9ca3af', textAlign: 'center', paddingTop: '48px' }}>
            &ldquo;{query}&rdquo; için sonuç bulunamadı.
          </p>
        ) : !query ? (
          <p style={{ fontSize: '16px', color: '#9ca3af', textAlign: 'center', paddingTop: '48px' }}>
            Aramak istediğin kelimeyi yaz ve Enter'a bas.
          </p>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {results.length} sonuç · &ldquo;{query}&rdquo;
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {results.map((post, i) => (
                <article
                  key={post.id}
                  className="fade-in"
                  style={{
                    borderTop: i === 0 ? '1px solid #e5e7eb' : 'none',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '28px 0',
                  }}
                >
                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    {post.categories?.[0] && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#A30000', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {post.categories[0]}
                      </span>
                    )}
                    {post.categories?.[0] && post.reading_time && (
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#d1d5db', display: 'inline-block' }} />
                    )}
                    {post.reading_time && (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {post.reading_time}
                      </span>
                    )}
                  </div>

                  {/* Başlık */}
                  <Link href={`/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <h2
                      className="category-post-title"
                      style={{
                        fontSize: '22px',
                        lineHeight: '30px',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: '#1b1c1c',
                        marginBottom: '10px',
                      }}
                    >
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p style={{ fontSize: '15px', lineHeight: '24px', color: '#5f5e5e', marginBottom: '14px' }}>
                      {post.excerpt}
                    </p>
                  )}

                  {/* Tarih + Devamını oku */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <time
                      dateTime={post.published_at}
                      style={{ fontSize: '13px', color: '#9ca3af' }}
                    >
                      {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
                    </time>
                    <Link
                      href={`/${post.slug}`}
                      style={{ fontSize: '13px', fontWeight: 700, color: '#1b1c1c', textDecoration: 'none' }}
                    >
                      Oku →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
