import AdminShell from '@/components/admin/AdminShell'
import PageEditor from '@/components/admin/PageEditor'

export const dynamic = 'force-dynamic'

export default async function NewPagePage() {
  return (
    <AdminShell currentPath="/admin/pages/new">
      <PageEditor />
    </AdminShell>
  )
}
