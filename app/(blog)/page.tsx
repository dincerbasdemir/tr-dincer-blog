import { supabase, getSiteSettings } from '@/lib/supabase'
import PostList from '@/components/PostList'
import Link from 'next/link'

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, categories, reading_time, featured_image')
    .order('published_at', { ascending: false })
    .limit(10)
  if (error) return []
  return data
}

const socialIcons: Record<string, { svg: JSX.Element }> = {
  social_x: {
    svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  social_website: {
    svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  },
  social_instagram: {
    svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  },
  social_youtube: {
    svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  social_linkedin: {
    svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
}

export default async function Home() {
  const [posts, settings] = await Promise.all([getPosts(), getSiteSettings()])

  const authorName = settings.author_name || 'Dinçer'
  const authorTitle = settings.author_title || 'Dijital Pazarlama Danışmanı'
  const authorPhoto = settings.author_photo || ''
  const siteTagline = settings.site_tagline || 'Ağacı sev, yeşili koru, ayıyı öp.'
  const siteDescription = settings.site_description || 'Teknoloji, tasarım, pazarlama ve günlük düşünceler üzerine sessiz bir köşe.'

  // Collect active social links
  const activeSocials = Object.entries(socialIcons)
    .filter(([key]) => settings[key])
    .map(([key, icon]) => ({ key, url: settings[key], ...icon }))

  // Split tagline — son 2 kelime highlight olacak
  const taglineWords = siteTagline.split(' ')
  const highlightWords = taglineWords.length >= 2
    ? taglineWords.slice(-2).join(' ')
    : taglineWords.pop() || ''
  const mainTagline = taglineWords.length >= 2
    ? taglineWords.slice(0, -2).join(' ')
    : ''

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-5 pt-16 pb-14">

        {/* Yazar kartı */}
        <div className="flex items-center gap-3 mb-8">
          {authorPhoto ? (
            <img
              src={authorPhoto}
              alt={authorName}
              className="w-11 h-11 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
              style={{ backgroundColor: '#1b1c1c', fontSize: '15px' }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <div className="font-bold text-sm" style={{ color: '#1b1c1c' }}>{authorName}</div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>{authorTitle}</div>
          </div>

          {activeSocials.length > 0 && (
            <>
              <div style={{ width: '1px', height: '36px', backgroundColor: '#e5e7eb', margin: '0 8px' }} />
              <div className="flex items-center gap-3">
                {activeSocials.map(social => (
                  <a
                    key={social.key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Başlık */}
        <h1
          className="mb-4 text-balance"
          style={{ fontSize: '52px', lineHeight: '60px', fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', maxWidth: '700px' }}
        >
          {mainTagline}{mainTagline ? ' ' : ''}
          <span style={{ color: '#A30000' }}>
            {highlightWords}
          </span>
        </h1>

        {/* Alt yazı */}
        <p style={{ fontSize: '16px', lineHeight: '26px', color: '#6b7280', maxWidth: '420px', marginBottom: '28px' }}>
          {siteDescription}
        </p>

        {/* Buton */}
        <Link
          href="/ben"
          className="inline-flex items-center font-semibold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#1b1c1c', borderRadius: '999px', padding: '10px 24px', fontSize: '14px' }}
        >
          Benimle Tanış
        </Link>
      </section>

      {/* ── Yazı Listesi ── */}
      <section className="max-w-[900px] mx-auto px-5 pb-24">
        <PostList initialPosts={posts} initialOffset={10} authorName={authorName} authorPhoto={authorPhoto} />
      </section>

    </div>
  )
}

export const dynamic = 'force-dynamic'
