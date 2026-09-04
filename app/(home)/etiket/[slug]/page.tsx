import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/slug'
import SharedHero from '@/components/SharedHero'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type TagPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string
  reading_time: string | null
  tags: string[] | null
}

// Etiket slug'ına göre yazıları ve etiketin görünen adını bul
async function getPostsByTag(tagSlug: string): Promise<{ posts: TagPost[]; label: string | null }> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, reading_time, tags')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error || !data) return { posts: [], label: null }

  let label: string | null = null
  const posts = data.filter(post => {
    const match = (post.tags || []).find((t: string) => slugify(t) === tagSlug)
    if (match && !label) label = match
    return !!match
  })

  return { posts, label }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { posts, label } = await getPostsByTag(params.slug)
  if (!label) return { title: 'Etiket bulunamadı' }
  return {
    title: `#${label} - tr.dincer`,
    description: `${label} etiketli yazılar`,
    // Tek yazılı etiketler ince içerik sayılmasın diye indekslenmez
    robots: posts.length < 2 ? { index: false, follow: true } : { index: true, follow: true },
  }
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const { posts, label } = await getPostsByTag(params.slug)

  if (!label) notFound()

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title={`#${label}`}
          description={`${posts.length} yazı`}
          activeTab=""
        />

        {/* Yazı listesi */}
        <div className="px-5 pb-16 sm:px-16 sm:pb-20">
          {posts.length === 0 ? (
            <p style={{ color: '#9ca3af', padding: '48px 0', fontSize: '15px' }}>
              Bu etikette henüz yazı bulunmuyor.
            </p>
          ) : (
            posts.map((post, index) => (
              <article key={post.id} style={{ borderTop: index === 0 ? 'none' : '1px solid #f0f0f0' }}>
                <Link
                  href={`/${post.slug}`}
                  style={{ display: 'block', padding: '32px 0', textDecoration: 'none' }}
                  className="group"
                >
                  {/* Tarih */}
                  <div style={{ marginBottom: '12px' }}>
                    <time
                      dateTime={post.published_at}
                      style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#adb5bd' }}
                    >
                      {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
                    </time>
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
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
