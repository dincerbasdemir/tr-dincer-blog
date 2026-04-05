'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Yazılar', exact: true },
  { href: '/admin/posts/new', label: 'Yeni Yazı', exact: false },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const isLogin = pathname === '/admin/login'

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  if (isLogin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f5f6f8',
          fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
        backgroundColor: '#f5f6f8',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '216px',
          flexShrink: 0,
          backgroundColor: '#111827',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>
              tr.dincer
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              admin panel
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: '14px 10px', flex: 1 }}>
          {navItems.map(item => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== '/admin'

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
                  marginBottom: '2px',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 10px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '13px', color: 'rgba(255,255,255,0.35)',
              marginBottom: '2px',
            }}
          >
            ↗ Blogu Gör
          </a>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '8px',
              border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
              fontSize: '13px', color: 'rgba(255,255,255,0.35)',
              width: '100%', textAlign: 'left',
            }}
          >
            ← Çıkış
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {children}
      </main>
    </div>
  )
}
