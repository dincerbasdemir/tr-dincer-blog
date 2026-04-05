import { supabase } from '@/lib/supabase'
import PostList from '@/components/PostList'

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, published_at, categories, reading_time, featured_image')
    .order('published_at', { ascending: false })
    .limit(10)
  if (error) return []
  return data
}

async function getHeroImage() {
  const { data } = await supabase
    .from('posts')
    .select('featured_image, title')
    .not('featured_image', 'is', null)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()
  return data
}

export default async function Home() {
  const [posts, hero] = await Promise.all([getPosts(), getHeroImage()])

  return (
    <div className="max-w-[740px] mx-auto px-5 pb-24">

      {/* ── Hero ── */}
      <section className="pt-14 pb-16">
        <h1
          className="mb-4"
          style={{ fontSize: '38px', lineHeight: '46px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}
        >
          tr.dincer — Ağacı sev, yeşili koru, ayıyı öp.
        </h1>
        <p style={{ fontSize: '16px', lineHeight: '26px', color: '#6b7280', maxWidth: '520px' }}>
          Teknoloji, tasarım, pazarlama ve günlük düşünceler üzerine kişisel yazılar.
        </p>

        {/* Hero görsel */}
        {hero?.featured_image && (
          <figure className="mt-10">
            <img
              src={hero.featured_image}
              alt={hero.title}
              className="w-full object-cover"
              style={{ aspectRatio: '16/9', borderRadius: '2px' }}
            />
          </figure>
        )}
      </section>

      {/* ── Son Yazılar ── */}
      <section>
        <h2
          className="mb-6"
          style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af' }}
        >
          Son Yazılar
        </h2>

        <PostList initialPosts={posts} initialOffset={10} />
      </section>

    </div>
  )
}

export const revalidate = 3600
