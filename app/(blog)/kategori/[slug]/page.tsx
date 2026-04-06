import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const categoryMap: { [key: string]: string } = {
  'gunluk': 'Günlük',
  'dijital-pazarlama': 'Dijital Pazarlama',
  'genel-kultur': 'Genel Kültür',
  'tasarim': 'Tasarım',
  'teknoloji': 'Teknoloji',
  'yapay-zeka': 'Yapay Zeka',
  'podcast': 'Podcast',
  'bilim': 'Bilim',
  'alintilar': 'Alıntılar',
}

async function getPostsByCategory(categorySlug: string) {
  const categoryName = categoryMap[categorySlug]
  if (!categoryName) return []

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, reading_time, categories')
    .contains('categories', [categoryName])
    .order('published_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoryName = categoryMap[params.slug]
  if (!categoryName) return { title: 'Kategori bulunamadı' }
  return {
    title: `${categoryName} - tr.dincer`,
    description: `${categoryName} kategorisindeki yazılar`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = await getPostsByCategory(params.slug)
  const categoryName = categoryMap[params.slug]

  if (!categoryName) notFound()

  return (
    <div style={{ backgroundColor: '#fbf9f8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '64px 20px 96px' }}>

        {/* Başlık */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#870500',
            marginBottom: '12px',
          }}>
            Kategori
          </div>
          <h1 style={{
            fontSize: '48px',
            lineHeight: '56px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#1b1c1c',
            margin: 0,
          }}>
            {categoryName}
          </h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '12px' }}>
            {posts.length} yazı
          </p>
        </div>

        {/* Yazı listesi */}
        {posts.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '48px 0', fontSize: '16px' }}>
            Bu kategoride henüz yazı bulunmuyor.
          </p>
        ) : (
          <div>
            {posts.map((post, index) => (
              <article
                key={post.id}
                style={{
                  paddingBottom: '40px',
                  marginBottom: '40px',
                  borderBottom: index < posts.length - 1 ? '1px solid rgba(195,198,214,0.3)' : 'none',
                }}
              >
                {/* Meta */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  fontSize: '13px',
                  color: '#9ca3af',
                }}>
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
                  </time>
                  {post.reading_time && (
                    <>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#c3c6d6', display: 'inline-block' }} />
                      <span>{post.reading_time}</span>
                    </>
                  )}
                </div>

                {/* Başlık */}
                <Link href={`/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <h2 className="category-post-title" style={{
                    fontSize: '26px',
                    lineHeight: '34px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#1b1c1c',
                    margin: '0 0 10px',
                  }}>
                    {post.title}
                  </h2>
                </Link>

                {/* Excerpt */}
                {post.excerpt && (
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '26px',
                    color: '#5f5e5e',
                    margin: '0 0 16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }}>
                    {post.excerpt}
                  </p>
                )}

                {/* Devamını oku */}
                <Link
                  href={`/${post.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#870500',
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  Devamını oku
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
