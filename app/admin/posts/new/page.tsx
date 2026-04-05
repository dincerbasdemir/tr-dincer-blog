import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import PostEditor from '@/components/admin/PostEditor'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const supabase = createAdminClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <AdminShell currentPath="/admin/posts/new">
      <PostEditor categories={categories || []} />
    </AdminShell>
  )
}
