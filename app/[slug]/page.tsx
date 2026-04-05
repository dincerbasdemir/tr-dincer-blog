import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { Metadata } from 'next'

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Yazı bulunamadı' }

  return {
    title: `${post.title} - tr.dincer`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.published_at,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <article
        className="bg-white border border-gray-200 px-8 md:px-12 py-10"
        style={{ borderRadius: '4px' }}
      >
        {/* Header */}
        <header className="mb-10">
          <h1
            className="font-semibold text-gray-900 mb-5 text-balance"
            style={{ fontSize: '41px', lineHeight: '51px' }}
          >
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-gray-400" style={{ fontSize: '14px' }}>
            <time dateTime={post.published_at}>
              {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
            </time>
            {post.reading_time && <><span>·</span><span>{post.reading_time}</span></>}
            {post.categories && post.categories.length > 0 && (
              <><span>·</span><span>{post.categories.join(', ')}</span></>
            )}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-gray-500 bg-gray-50 border border-gray-200"
                  style={{ fontSize: '12px', borderRadius: '2px' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <a
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
            style={{ fontSize: '14px' }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tüm yazılara dön
          </a>
        </div>
      </article>
    </div>
  )
}

export const revalidate = 3600
