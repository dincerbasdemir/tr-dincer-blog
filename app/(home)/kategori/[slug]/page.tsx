import { supabase } from '@/lib/supabase'
import SharedHero from '@/components/SharedHero'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const categoryMap: { [key: string]: string } = {
  'gunluk': 'Günlük',
  'dijital-pazarlama': 'Pazarlama',
  'genel-kultur': 'Genel Kültür',
  'tasarim': 'Tasarım',
  'teknoloji': 'Teknoloji',
  'yapay-zeka': 'Yapay Zeka',
  'podcast': 'Podcast',
  'bilim': 'Bilim',
  'alintilar': 'Alıntılar',
}

// Gerçek kategori adını DB'de nasıl sakladığımıza göre map
const categoryDbName: { [key: string]: string } = {
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
  const categoryName = categoryDbName[categorySlug]
  if (!categoryName) return []
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, reading_time, categories')
    .eq('status', 'published')
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

  const activeTab = `/kategori/${params.slug}`

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title={categoryName}
          description={`${posts.length} yazı`}
          activeTab={activeTab}
        />

        {/* Yazı listesi */}
        <div className="px-5 pb-16 sm:px-16 sm:pb-20">
          {posts.length === 0 ? (
            <p style={{ color: '#9ca3af', padding: '48px 0', fontSize: '15px' }}>
              Bu kategoride henüz yazı bulunmuyor.
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
