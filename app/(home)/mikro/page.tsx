import { supabase, getSiteSettings } from '@/lib/supabase'
import SharedHero from '@/components/SharedHero'
import MicroPostCard from '@/components/MicroPostCard'

export const dynamic = 'force-dynamic'

async function getMicroPosts() {
  const { data, error } = await supabase
    .from('micro_posts')
    .select('id, content, created_at, pinned')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

export default async function MikroPage() {
  const [posts, settings] = await Promise.all([getMicroPosts(), getSiteSettings()])

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title="Mikro"
          description="Kısa düşünceler, notlar ve anlık fikirler."
          activeTab="/mikro"
        />

        <div className="px-5 pb-16 sm:px-16 sm:pb-20">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>💭</div>
              <p style={{ fontSize: '14px', margin: 0 }}>Henüz mikro yazı yok.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '32px' }}>
              {posts.map(post => (
                <MicroPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
