import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createAdminClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, published_at, categories, status')
    .order('published_at', { ascending: false })

  const allPosts = posts || []
  const publishedCount = allPosts.filter(p => p.status !== 'draft').length
  const draftCount = allPosts.filter(p => p.status === 'draft').length

  return (
    <AdminShell>
      <div style={{ padding: '36px 40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
              Yazılar
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              {allPosts.length} yazı
              {publishedCount > 0 && (
                <> · <span style={{ color: '#16a34a' }}>{publishedCount} yayında</span></>
              )}
              {draftCount > 0 && (
                <> · <span style={{ color: '#d97706' }}>{draftCount} taslak</span></>
              )}
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#111827', color: 'white',
              padding: '10px 18px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '13px', fontWeight: 700,
            }}
          >
            + Yeni Yazı
          </Link>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
            padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#dc2626',
          }}>
            Hata: {error.message}
          </div>
        )}

        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {allPosts.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✍️</div>
              <p style={{ fontSize: '14px', margin: '0 0 8px' }}>Henüz yazı yok.</p>
              <Link href="/admin/posts/new" style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>
                İlk yazını oluştur →
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Başlık', 'Kategori', 'Tarih', 'Durum', ''].map(h => (
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
                {allPosts.map((post, i) => (
                  <tr key={post.id} style={{ borderBottom: i < allPosts.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                    <td style={{ padding: '14px 20px', maxWidth: '420px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', lineHeight: 1.4, wordBreak: 'break-word' }}>
                        {post.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#c4c7d0', marginTop: '2px' }}>
                        /{post.slug}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      {post.categories?.[0] ? (
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', backgroundColor: '#f3f4f6', borderRadius: '999px', color: '#374151' }}>
                          {post.categories[0]}
                        </span>
                      ) : <span style={{ color: '#d1d5db', fontSize: '13px' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {post.published_at ? format(new Date(post.published_at), 'd MMM yyyy', { locale: tr }) : '—'}
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
                        backgroundColor: post.status === 'draft' ? '#fef3c7' : '#dcfce7',
                        color: post.status === 'draft' ? '#92400e' : '#166534',
                      }}>
                        {post.status === 'draft' ? 'Taslak' : 'Yayında'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/posts/${post.id}/edit`} style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          Düzenle
                        </Link>
                        <a href={`/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none', padding: '5px 10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
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
