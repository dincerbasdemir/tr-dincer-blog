import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

const PER_PAGE = 20

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = createAdminClient()
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const [
    { data: posts, error, count: totalCount },
    { count: activeSubscribers },
    { data: viewData },
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, slug, published_at, categories, views, status', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(from, to),
    supabase
      .from('subscribers')
      .select('id', { count: 'exact', head: true })
      .eq('active', true),
    supabase
      .from('posts')
      .select('views')
      .eq('status', 'published'),
  ])

  const allPosts = posts || []
  const publishedPosts = allPosts.filter(p => p.status === 'published')
  const totalPages = Math.ceil((totalCount ?? 0) / PER_PAGE)
  const totalViews = (viewData || []).reduce((sum, p) => sum + (p.views || 0), 0)

  const stats = [
    {
      label: 'Toplam Yazı',
      value: totalCount ?? 0,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Toplam Görüntülenme',
      value: totalViews.toLocaleString('tr-TR'),
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: 'Aktif Abone',
      value: activeSubscribers ?? 0,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <AdminShell currentPath="/admin">
      <div style={{ padding: '36px 40px' }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Yazılar
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              {allPosts.length} yazı
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#111827', color: 'white',
              padding: '9px 16px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '13px', fontWeight: 700,
            }}
          >
            + Yeni Yazı
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '22px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f3f4f6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {stat.label}
                </span>
                <span style={{ color: '#9ca3af' }}>
                  {stat.icon}
                </span>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#dc2626' }}>
            Veritabanı hatası: {error.message}
          </div>
        )}

        {/* ── Posts table ── */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          {allPosts.length === 0 && !error ? (
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
                  {['Başlık', 'Kategori', 'Görüntülenme', 'Tarih', ''].map(h => (
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
                    <td style={{ padding: '14px 20px', maxWidth: '380px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827', lineHeight: 1.4, wordBreak: 'break-word' }}>
                            {post.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#d1d5db', marginTop: '2px' }}>
                            /{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      {post.categories?.[0] ? (
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', backgroundColor: '#f3f4f6', borderRadius: '999px', color: '#374151' }}>
                          {post.categories[0]}
                        </span>
                      ) : <span style={{ color: '#d1d5db', fontSize: '13px' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {(post.views ?? 0).toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {post.published_at ? format(new Date(post.published_at), 'd MMM yyyy', { locale: tr }) : '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', whiteSpace: 'nowrap', backgroundColor: '#fff' }}
                        >
                          Düzenle
                        </Link>
                        <a
                          href={`/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none', padding: '5px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fff' }}
                        >
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

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>
              {from + 1}–{Math.min(to + 1, totalCount ?? 0)} / {totalCount} yazı
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {page > 1 ? (
                <Link
                  href={`/admin?page=${page - 1}`}
                  style={{
                    padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                    border: '1px solid #e5e7eb', borderRadius: '8px',
                    textDecoration: 'none', color: '#374151', backgroundColor: '#fff',
                  }}
                >
                  ← Önceki
                </Link>
              ) : (
                <span style={{
                  padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                  border: '1px solid #f3f4f6', borderRadius: '8px',
                  color: '#d1d5db', backgroundColor: '#f9fafb',
                  cursor: 'not-allowed',
                }}>
                  ← Önceki
                </span>
              )}

              {/* Sayfa numaraları */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push('...')
                    }
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} style={{ padding: '7px 6px', fontSize: '13px', color: '#9ca3af' }}>…</span>
                    ) : (
                      <Link
                        key={p}
                        href={`/admin?page=${p}`}
                        style={{
                          padding: '7px 12px', fontSize: '13px', fontWeight: 600,
                          border: '1px solid ' + (p === page ? '#111827' : '#e5e7eb'),
                          borderRadius: '8px', textDecoration: 'none',
                          color: p === page ? '#ffffff' : '#374151',
                          backgroundColor: p === page ? '#111827' : '#fff',
                          minWidth: '36px', textAlign: 'center',
                        }}
                      >
                        {p}
                      </Link>
                    )
                  )}
              </div>

              {page < totalPages ? (
                <Link
                  href={`/admin?page=${page + 1}`}
                  style={{
                    padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                    border: '1px solid #e5e7eb', borderRadius: '8px',
                    textDecoration: 'none', color: '#374151', backgroundColor: '#fff',
                  }}
                >
                  Sonraki →
                </Link>
              ) : (
                <span style={{
                  padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                  border: '1px solid #f3f4f6', borderRadius: '8px',
                  color: '#d1d5db', backgroundColor: '#f9fafb',
                  cursor: 'not-allowed',
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
