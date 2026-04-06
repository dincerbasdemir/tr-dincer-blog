import { supabase, getSiteSettings } from '@/lib/supabase'
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

async function getPage(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (post) {
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
  const page = await getPage(params.slug)
  if (!page) return { title: 'Sayfa bulunamadı' }
  return {
    title: `${page.title} - tr.dincer`,
    description: page.title,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const [post, page, settings] = await Promise.all([getPost(params.slug), getPage(params.slug), getSiteSettings()])

  // Eğer post yoksa ama page varsa, sayfa olarak render et
  if (!post && page) {
    return (
      <div style={{ backgroundColor: '#fbf9f8', minHeight: '100vh' }}>
        <article className="max-w-[740px] mx-auto px-5 pt-14 pb-24">
          <a
            href="/"
            className="text-xs font-semibold uppercase tracking-widest transition-colors hover:text-gray-900 inline-block mb-10"
            style={{ color: '#5f5e5e' }}
          >
            ← Ana Sayfa
          </a>
          <h1
            style={{
              fontSize: '45px',
              lineHeight: '54px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#1b1c1c',
              marginBottom: '48px',
            }}
          >
            {page.title}
          </h1>
          <div className="prose article-body" dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </div>
    )
  }

  if (!post) notFound()

  const authorName = settings.author_name || 'Dinçer'
  const authorPhoto = settings.author_photo || ''
  const authorBio = settings.author_bio || ''
  const authorTitle = settings.author_title || ''

  const socialLinks = [
    { key: 'social_x', url: settings.social_x, label: 'X', icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { key: 'social_instagram', url: settings.social_instagram, label: 'Instagram', icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
    { key: 'social_youtube', url: settings.social_youtube, label: 'YouTube', icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
    { key: 'social_linkedin', url: settings.social_linkedin, label: 'LinkedIn', icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
    { key: 'social_website', url: settings.social_website, label: 'Website', icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  ].filter(s => s.url)

  return (
    <div style={{ backgroundColor: '#fbf9f8', minHeight: '100vh' }}>
      <article className="max-w-[740px] mx-auto px-5 pt-14 pb-24">

        {/* Kategori + Okuma Süresi */}
        <div className="flex items-center gap-2 mb-8 text-xs tracking-widest uppercase font-semibold" style={{ color: '#A30000' }}>
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
          <div className="flex items-center gap-3">
            {authorPhoto ? (
              <img src={authorPhoto} alt={authorName} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: '#1b1c1c', fontSize: '13px' }}
              >
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-bold" style={{ color: '#1b1c1c' }}>{authorName}</div>
              <div className="text-xs" style={{ color: '#5f5e5e' }}>
                {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
              </div>
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
              style={{ display: 'block', width: '100%', height: 'auto', border: 'none', outline: 'none', borderRadius: 0, boxShadow: 'none', verticalAlign: 'bottom', clipPath: 'inset(1px)' }}
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

        {/* Yazar kutusu */}
        {authorBio && (
          <div style={{
            marginTop: '16px',
            padding: '36px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(195,198,214,0.2)',
          }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Fotoğraf */}
              {authorPhoto ? (
                <img
                  src={authorPhoto}
                  alt={authorName}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#1b1c1c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Bilgiler */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em',
                    color: '#9ca3af',
                  }}>
                    Yazan
                  </span>
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#1b1c1c',
                  letterSpacing: '-0.01em',
                  marginBottom: '2px',
                }}>
                  {authorName}
                </div>
                {authorTitle && (
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '12px',
                  }}>
                    {authorTitle}
                  </div>
                )}
                <p style={{
                  fontSize: '15px',
                  lineHeight: '24px',
                  color: '#4b5563',
                  margin: 0,
                }}>
                  {authorBio}
                </p>

                {/* Sosyal linkler */}
                {socialLinks.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '16px',
                  }}>
                    {socialLinks.map(social => (
                      <a
                        key={social.key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          transition: 'all 0.15s',
                          textDecoration: 'none',
                        }}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </article>
    </div>
  )
}

export const dynamic = 'force-dynamic'
