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
  
  if (!categoryName) {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .contains('categories', [categoryName])
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data || []
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoryName = categoryMap[params.slug]

  if (!categoryName) {
    return { title: 'Kategori bulunamadı' }
  }

  return {
    title: `${categoryName} - tr.dincer`,
    description: `${categoryName} kategorisindeki yazılar`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = await getPostsByCategory(params.slug)
  const categoryName = categoryMap[params.slug]

  if (!categoryName) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {categoryName}
        </h1>
        <p className="text-gray-600">
          {posts.length} yazı
        </p>
      </div>

      <div className="space-y-12">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            Bu kategoride henüz yazı bulunmuyor.
          </p>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </div>
    </div>
  )
}

export const revalidate = 3600
