import { supabase } from '@/lib/supabase'
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

export default async function Home() {
  const posts = await getPosts()

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-5 pt-16 pb-14">

        {/* Yazar kartı */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ backgroundColor: '#1b1c1c', fontSize: '15px' }}
          >
            D
          </div>
          <div className="text-left">
            <div className="font-bold text-sm" style={{ color: '#1b1c1c' }}>Dinçer</div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>Dijital Pazarlama Danışmanı</div>
          </div>
          <div style={{ width: '1px', height: '36px', backgroundColor: '#e5e7eb', margin: '0 8px' }} />
          {/* Sosyal ikonlar */}
          <div className="flex items-center gap-3">
            <a href="https://x.com/dincerbasdemir" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://dincer.co" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </a>
          </div>
        </div>

        {/* Başlık */}
        <h1
          className="mb-4 text-balance"
          style={{ fontSize: '52px', lineHeight: '60px', fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', maxWidth: '700px' }}
        >
          Ağacı sev, yeşili koru,{' '}
          <span style={{ backgroundColor: '#dbeafe', borderRadius: '6px', padding: '0 6px' }}>
            ayıyı öp.
          </span>
        </h1>

        {/* Alt yazı */}
        <p style={{ fontSize: '16px', lineHeight: '26px', color: '#6b7280', maxWidth: '420px', marginBottom: '28px' }}>
          Teknoloji, tasarım, pazarlama ve günlük düşünceler üzerine sessiz bir köşe.
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
        <PostList initialPosts={posts} initialOffset={10} />
      </section>

    </div>
  )
}

export const dynamic = 'force-dynamic'
