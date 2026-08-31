import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import MicroComposer from '@/components/admin/MicroComposer'
import MicroAdminList from '@/components/admin/MicroAdminList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PER_PAGE = 20

export default async function AdminMikroPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = createAdminClient()
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const { data: posts, count } = await supabase
    .from('micro_posts')
    .select('id, content, created_at, pinned', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / PER_PAGE)

  return (
    <AdminShell currentPath="/admin/mikro">
      <div style={{ padding: 'clamp(20px, 5vw, 36px) clamp(16px, 5vw, 40px)', maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Mikro
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            {totalCount} yazı
          </p>
        </div>

        {/* Composer */}
        <MicroComposer />

        {/* Post listesi */}
        <MicroAdminList posts={posts || []} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f0f0f0',
          }}>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>
              Sayfa {page} / {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {page > 1 ? (
                <Link href={`/admin/mikro?page=${page - 1}`}
                  style={{
                    padding: '7px 16px', border: '1px solid #e5e7eb', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 600, color: '#374151',
                    textDecoration: 'none', backgroundColor: '#ffffff',
                  }}>
                  ← Önceki
                </Link>
              ) : (
                <span style={{
                  padding: '7px 16px', border: '1px solid #f0f0f0', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 600, color: '#d1d5db', backgroundColor: '#fafafa',
                }}>
                  ← Önceki
                </span>
              )}
              {page < totalPages ? (
                <Link href={`/admin/mikro?page=${page + 1}`}
                  style={{
                    padding: '7px 16px', border: '1px solid #e5e7eb', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 600, color: '#374151',
                    textDecoration: 'none', backgroundColor: '#ffffff',
                  }}>
                  Sonraki →
                </Link>
              ) : (
                <span style={{
                  padding: '7px 16px', border: '1px solid #f0f0f0', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 600, color: '#d1d5db', backgroundColor: '#fafafa',
                }}>
                  Sonraki →
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
