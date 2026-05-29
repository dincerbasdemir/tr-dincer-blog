import { supabase, getSiteSettings } from '@/lib/supabase'
import SharedHero from '@/components/SharedHero'
import MicroPostList from '@/components/MicroPostList'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

async function getMicroPosts() {
  // Sabitlenenler her zaman öne gelsin, sonra tarih sırasıyla ilk 20
  const { data, error } = await supabase
    .from('micro_posts')
    .select('id, content, created_at, pinned')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)
  if (error) return []
  return data
}

async function getTotalCount() {
  const { count } = await supabase
    .from('micro_posts')
    .select('id', { count: 'exact', head: true })
  return count ?? 0
}

export default async function MikroPage() {
  const [posts, total] = await Promise.all([getMicroPosts(), getTotalCount()])
  const initialHasMore = total > PAGE_SIZE

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title="Mikro"
          description="Kısa düşünceler, notlar ve anlık fikirler."
          activeTab="/mikro"
        />

        <div className="px-5 pb-16 sm:px-16 sm:pb-20">
          <MicroPostList initialPosts={posts} initialHasMore={initialHasMore} />
        </div>

      </div>
    </div>
  )
}
