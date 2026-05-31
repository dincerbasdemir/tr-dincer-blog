import { supabase, getSiteSettings } from '@/lib/supabase'
import PostList from '@/components/PostList'
import SharedHero from '@/components/SharedHero'
import SubscribeForm from '@/components/SubscribeForm'
import NowSection from '@/components/NowSection'

async function getNowItems() {
  const { data } = await supabase
    .from('now_items')
    .select('id, category, title, subtitle, url')
    .order('sort_order')
    .order('created_at', { ascending: false })
  return data || []
}

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, categories, reading_time, featured_image')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10)
  if (error) return []
  return data
}

export default async function Home() {
  const [posts, settings, nowItems] = await Promise.all([getPosts(), getSiteSettings(), getNowItems()])

  const siteTagline = settings.site_tagline || 'Ağacı sev, yeşili koru, ayıyı öp.'
  const siteDescription = settings.site_description || 'Teknoloji, tasarım, pazarlama ve günlük düşünceler üzerine sessiz bir köşe.'

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title={
            <>
              {siteTagline}
              <a
                href="https://www.instagram.com/p/CR_b_QtDOMX/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', opacity: 0.5 }}
              >*</a>
            </>
          }
          description={siteDescription}
          activeTab="/"
        />

        <NowSection items={nowItems} />

        <div className="px-5 pb-16 sm:px-16 sm:pb-20">
          <PostList initialPosts={posts} initialOffset={10} />
        </div>

        <SubscribeForm />

      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
