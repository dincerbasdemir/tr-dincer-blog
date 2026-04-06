import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import PageEditor from '@/components/admin/PageEditor'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditPagePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!page) notFound()

  return (
    <AdminShell currentPath={`/admin/pages/${params.id}/edit`}>
      <PageEditor page={page} />
    </AdminShell>
  )
}
