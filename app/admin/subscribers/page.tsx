import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function SubscribersPage() {
  const supabase = createAdminClient()

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email, active, created_at')
    .order('created_at', { ascending: false })

  const allSubs = subscribers || []
  const activeSubs = allSubs.filter(s => s.active)
  const inactiveSubs = allSubs.filter(s => !s.active)

  return (
    <AdminShell currentPath="/admin/subscribers">
      <div style={{ padding: '36px 40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
              Aboneler
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              {activeSubs.length} aktif · {inactiveSubs.length} pasif · toplam {allSubs.length}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '14px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              textAlign: 'center',
              minWidth: '90px',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                {activeSubs.length}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Aktif
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '14px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              textAlign: 'center',
              minWidth: '90px',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#9ca3af', lineHeight: 1 }}>
                {inactiveSubs.length}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Pasif
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#dc2626' }}>
            Veritabanı hatası: {error.message}
          </div>
        )}

        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {allSubs.length === 0 && !error ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
              <p style={{ fontSize: '14px', margin: 0 }}>Henüz abone yok.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['E-posta', 'Durum', 'Abone Tarihi'].map(h => (
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
                {allSubs.map((sub, i) => (
                  <tr key={sub.id} style={{ borderBottom: i < allSubs.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                        {sub.email}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      {sub.active ? (
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px',
                          backgroundColor: '#f0fdf4',
                          color: '#16a34a',
                          borderRadius: '999px',
                        }}>
                          Aktif
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px',
                          backgroundColor: '#f9fafb',
                          color: '#9ca3af',
                          borderRadius: '999px',
                        }}>
                          Pasif
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {sub.created_at
                        ? format(new Date(sub.created_at), 'd MMM yyyy, HH:mm', { locale: tr })
                        : '—'}
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
