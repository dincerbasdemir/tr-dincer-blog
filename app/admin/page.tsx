import AdminShell from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

// Minimal test - no Supabase, no hooks, just static content
export default async function AdminDashboard() {
  return (
    <AdminShell currentPath="/admin">
      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>
          Admin çalışıyor ✓
        </h1>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>
          Panel başarıyla yüklendi.
        </p>
      </div>
    </AdminShell>
  )
}
