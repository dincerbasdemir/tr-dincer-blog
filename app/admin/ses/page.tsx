import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import AudioManager from '@/components/admin/AudioManager'

export const dynamic = 'force-dynamic'

export default async function AdminSesPage() {
  const supabase = createAdminClient()

  const [{ data: episodes }, { data: coverRow }] = await Promise.all([
    supabase
      .from('audio_episodes')
      .select('id, title, description, audio_path, duration, file_size, post_slug, published, plays, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'podcast_cover')
      .maybeSingle(),
  ])

  return (
    <AdminShell currentPath="/admin/ses">
      <AudioManager initial={episodes || []} initialCover={coverRow?.value || ''} />
    </AdminShell>
  )
}
