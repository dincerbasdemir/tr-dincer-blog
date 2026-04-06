import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import SiteSettings from '@/components/admin/SiteSettings'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  for (const row of data || []) {
    settings[row.key] = row.value
  }

  return (
    <AdminShell currentPath="/admin/settings">
      <SiteSettings initialSettings={settings} />
    </AdminShell>
  )
}
