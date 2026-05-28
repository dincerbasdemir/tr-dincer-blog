import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import MicroComposer from '@/components/admin/MicroComposer'
import MicroAdminList from '@/components/admin/MicroAdminList'

export const dynamic = 'force-dynamic'

export default async function AdminMikroPage() {
  const supabase = createAdminClient()

  const { data: posts } = await supabase
    .from('micro_posts')
    .select('id, content, created_at, pinned')
    .order('created_at', { ascending: false })

  return (
    <AdminShell currentPath="/admin/mikro">
      <div style={{ padding: '36px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Mikro
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            {(posts || []).length} yazı
          </p>
        </div>

        {/* Composer */}
        <MicroComposer />

        {/* Post listesi */}
        <MicroAdminList posts={posts || []} />
      </div>
    </AdminShell>
  )
}
