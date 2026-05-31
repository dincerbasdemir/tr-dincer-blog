import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import NowAdminList from '@/components/admin/NowAdminList'

export default async function AdminSimdiPage() {
  const supabase = createAdminClient()

  const [{ data: items }, { data: settings }] = await Promise.all([
    supabase
      .from('now_items')
      .select('*')
      .order('category')
      .order('sort_order')
      .order('created_at', { ascending: false }),
    supabase
      .from('site_settings')
      .select('key, value')
      .eq('key', 'now_note')
      .single(),
  ])

  const nowNote = settings?.value || ''

  return (
    <AdminShell currentPath="/admin/simdi">
      <div style={{ padding: '32px 32px 0', borderBottom: '1px solid #f0f0f0', backgroundColor: '#ffffff' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Şu An
        </h1>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
          Okuyorum, dinliyorum, üzerinde çalışıyorum —{' '}
          <a href="/now" target="_blank" style={{ color: '#d00202', textDecoration: 'none' }}>/now sayfasında</a> görünür.
        </p>
      </div>

      <NowAdminList initialItems={items || []} initialNote={nowNote} />
    </AdminShell>
  )
}

export const dynamic = 'force-dynamic'
