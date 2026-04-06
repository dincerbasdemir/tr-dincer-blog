import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminPagesPage() {
  const supabase = createAdminClient()

  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, title, slug, created_at, updated_at')
    .order('created_at', { ascending: false })

  const allPages = pages || []

  return (
    <AdminShell currentPath="/admin/pages">
      <div style={{ padding: '36px 40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
              Sayfalar
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              {allPages.length} sayfa
            </p>
          </div>
          <Link
            href="/admin/pages/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#111827', color: 'white',
              padding: '10px 18px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '13px', fontWeight: 700,
            }}
          >
            + Yeni Sayfa
          </Link>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#dc2626' }}>
            Veritabani hatasi: {error.message}
          </div>
        )}

        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {allPages.length === 0 && !error ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
              <p style={{ fontSize: '14px', margin: '0 0 8px' }}>Henuz sayfa yok.</p>
              <Link href="/admin/pages/new" style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>
                Ilk sayfani olustur
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Baslik', 'Slug', 'Guncelleme', ''].map(h => (
                    <th key={h} style={{
                      padding: '12px 20px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 700, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPages.map((page, i) => (
                  <tr key={page.id} style={{ borderBottom: i < allPages.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                    <td style={{ padding: '14px 20px', maxWidth: '440px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', lineHeight: 1.4, wordBreak: 'break-word' }}>
                        {page.title}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        /{page.slug}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {page.updated_at
                        ? format(new Date(page.updated_at), 'd MMM yyyy', { locale: tr })
                        : page.created_at
                          ? format(new Date(page.created_at), 'd MMM yyyy', { locale: tr })
                          : '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/pages/${page.id}/edit`} style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          Duzenle
                        </Link>
                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none', padding: '5px 10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                          ↗
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
