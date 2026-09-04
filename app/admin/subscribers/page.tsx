import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import SubscribersManager from '@/components/admin/SubscribersManager'

export const dynamic = 'force-dynamic'

export default async function SubscribersPage() {
  const supabase = createAdminClient()

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email, active, subscribed_at')
    .order('subscribed_at', { ascending: false })

  return (
    <AdminShell currentPath="/admin/subscribers">
      {error && (
        <div style={{ padding: '20px 40px' }}>
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#dc2626' }}>
            Veritabanı hatası: {error.message}
          </div>
        </div>
      )}
      <SubscribersManager initial={subscribers || []} />
    </AdminShell>
  )
}
