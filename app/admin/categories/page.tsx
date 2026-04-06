import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import CategoryManager from '@/components/admin/CategoryManager'

export const dynamic = 'force-dynamic'

export default async function AdminCategories() {
  const supabase = createAdminClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  return (
    <AdminShell currentPath="/admin/categories">
      <CategoryManager initialCategories={categories || []} />
    </AdminShell>
  )
}
