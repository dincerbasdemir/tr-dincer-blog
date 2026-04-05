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
    <div style={{ backgroundColor: '#fbf9f8', minHeight: '100vh' }}>
      <article className="max-w-[740px] mx-auto px-5 pt-14 pb-24">

        {/* Kategori + Okuma Süresi */}
        <div className="flex items-center gap-2 mb-8 text-xs tracking-widest uppercase font-semibold" style={{ color: '#870500' }}>
          {post.categories?.[0] && <span>{post.categories[0]}</span>}
          {post.reading_time && (
            <>
              <span className="inline-block w-1 h-1 rounded-full" style={{ backgroundColor: '#c3c6d6' }} />
              <span>{post.reading_time}</span>
            </>
          )}
        </div>

        {/* Başlık */}
        <h1
          className="mb-6"
          style={{
            fontSize: '45px',
            lineHeight: '54px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#1b1c1c',
          }}
        >
          {post.title}
        </h1>

        {/* Excerpt — italic lead */}
        {post.excerpt && (
          <p
            className="italic mb-10"
            style={{ fontSize: '21px', lineHeight: '34px', color: '#5f5e5e' }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Yazar + Tarih satırı */}
        <div
          className="flex items-center justify-between py-6 mb-14"
          style={{
            borderTop: '1px solid rgba(195,198,214,0.35)',
            borderBottom: '1px solid rgba(195,198,214,0.35)',
          }}
        >
          <div>
            <div className="text-sm font-bold" style={{ color: '#1b1c1c' }}>Dinçer</div>
            <div className="text-xs" style={{ color: '#5f5e5e' }}>
              {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
            </div>
          </div>
          <a
            href="/"
            className="text-xs font-semibold uppercase tracking-widest transition-colors hover:text-gray-900"
            style={{ color: '#5f5e5e' }}
          >
            ← Tüm yazılar
          </a>
        </div>

        {/* Featured görsel — full-bleed */}
        {post.featured_image && (
          <div style={{
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginBottom: '56px',
            lineHeight: 0,
          }}>
            <img
              src={post.featured_image}
              alt={post.title}
              style={{ display: 'block', width: '100%', height: 'auto', border: 'none', outline: 'none', borderRadius: 0, boxShadow: 'none', verticalAlign: 'bottom' }}
            />
          </div>
        )}

        {/* İçerik */}
        <div className="prose article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* 3-nokta separator */}
        <div className="flex justify-center items-center py-16 gap-3" style={{ color: '#c3c6d6' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
        </div>

        {/* Etiketler */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1"
                style={{
                  fontSize: '11px',
                  backgroundColor: '#efeded',
                  color: '#5f5e5e',
                  borderRadius: '2px',
                  letterSpacing: '0.05em',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </article>
    </div>
  )
}

export const dynamic = 'force-dynamic'
