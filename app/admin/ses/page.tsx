import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import AudioManager from '@/components/admin/AudioManager'

export const dynamic = 'force-dynamic'

export default async function AdminSesPage() {
  const supabase = createAdminClient()

  const { data: episodes } = await supabase
    .from('audio_episodes')
    .select('id, title, description, audio_path, duration, file_size, post_slug, published, created_at')
    .order('created_at', { ascending: false })

  return (
    <AdminShell currentPath="/admin/ses">
      <AudioManager initial={episodes || []} />
    </AdminShell>
  )
}
