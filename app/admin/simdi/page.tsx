import { createClient } from '@supabase/supabase-js'
import AdminShell from '@/components/admin/AdminShell'
import NowAdminList from '@/components/admin/NowAdminList'
import { headers } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function AdminSimdiPage() {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/admin/simdi'

  const { data: items } = await supabase
    .from('now_items')
    .select('*')
    .order('category')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return (
    <AdminShell currentPath="/admin/simdi">
      <div style={{ padding: '32px 32px 0', borderBottom: '1px solid #f0f0f0', backgroundColor: '#ffffff' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Şu An
        </h1>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
          Okuyorum, dinliyorum, üzerinde çalışıyorum — <a href="/now" target="_blank" style={{ color: '#d00202', textDecoration: 'none' }}>/now sayfasında</a> görünür.
        </p>
      </div>

      <NowAdminList initialItems={items || []} />
    </AdminShell>
  )
}

export const dynamic = 'force-dynamic'
