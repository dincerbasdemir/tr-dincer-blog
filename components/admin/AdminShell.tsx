'use client'

import Link from 'next/link'
import { useState } from 'react'

const IcoMenu = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
const IcoClose = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/* ── Icons ── */
const IcoPosts = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const IcoPlus = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)
const IcoPage = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)
const IcoHash = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l3-16m4 16l3-16M5 9h16M4 15h16" />
  </svg>
)
const IcoNow = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
  </svg>
)
const IcoMicro = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)
const IcoTag = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
  </svg>
)
const IcoUsers = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IcoSettings = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IcoExternal = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)
const IcoLogout = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

/* ── Nav config ── */
const navGroups = [
  {
    items: [
      { href: '/admin', label: 'Yazılar', icon: IcoPosts, exact: true },
      { href: '/admin/posts/new', label: 'Yeni Yazı', icon: IcoPlus, exact: true },
    ],
  },
  {
    items: [
      { href: '/admin/pages', label: 'Sayfalar', icon: IcoPage },
      { href: '/admin/pages/new', label: 'Yeni Sayfa', icon: IcoPlus, exact: true },
    ],
  },
  {
    items: [
      { href: '/admin/categories', label: 'Kategoriler', icon: IcoTag },
      { href: '/admin/etiketler', label: 'Etiketler', icon: IcoHash },
    ],
  },
  {
    items: [
      { href: '/admin/mikro', label: 'Mikro', icon: IcoMicro },
      { href: '/admin/simdi', label: 'Şu An', icon: IcoNow },
    ],
  },
  {
    items: [
      { href: '/admin/subscribers', label: 'Aboneler', icon: IcoUsers },
    ],
  },
  {
    items: [
      { href: '/admin/settings', label: 'Ayarlar', icon: IcoSettings },
    ],
  },
]

export default function AdminShell({
  children,
  currentPath = '',
}: {
  children: React.ReactNode
  currentPath?: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
    } finally {
      window.location.href = '/admin/login'
    }
  }

  return (
    <div className="admin-root" style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
      backgroundColor: '#f5f6f8',
    }}>
      {/* ── Mobil üst bar ── */}
      <div className="admin-mobile-bar">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Menü"
          style={{
            border: 'none', background: 'none', padding: '4px', cursor: 'pointer',
            color: '#111827', display: 'flex', alignItems: 'center',
          }}
        >
          <IcoMenu />
        </button>
        <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', backgroundColor: '#111827', borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 800 }}>T</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>tr.dincer</span>
        </Link>
      </div>

      {/* ── Mobil backdrop ── */}
      {mobileOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar${mobileOpen ? ' open' : ''}`} style={{
        width: '220px',
        flexShrink: 0,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}>
        {/* Mobil kapatma butonu */}
        <button
          className="admin-sidebar-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Kapat"
        >
          <IcoClose />
        </button>


        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #f3f4f6' }}>
          <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: 800, letterSpacing: '-0.02em' }}>T</span>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                tr.dincer
              </div>
              <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '1px' }}>
                Admin
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px', flex: 1, overflowY: 'auto' }}>
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && (
                <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '6px 4px' }} />
              )}
              {group.items.map(item => {
                const isActive = item.exact
                  ? currentPath === item.href
                  : currentPath.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ffffff' : '#6b7280',
                      backgroundColor: isActive ? '#111827' : 'transparent',
                      marginBottom: '1px',
                      transition: 'background 0.12s, color 0.12s',
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }}>
                      <Icon />
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isActive && (
                      <span style={{ fontSize: '16px', opacity: 0.4, lineHeight: 1 }}>›</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '10px', borderTop: '1px solid #f3f4f6' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 10px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '13px', color: '#9ca3af',
              marginBottom: '1px',
            }}
          >
            <IcoExternal />
            Blogu Gör
          </a>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 10px', borderRadius: '8px',
              border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
              fontSize: '13px', color: '#9ca3af',
              width: '100%', textAlign: 'left',
            }}
          >
            <IcoLogout />
            Çıkış
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="admin-main" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {children}
      </main>

      <style>{`
        .admin-mobile-bar { display: none; }
        .admin-sidebar-close { display: none; }

        @media (max-width: 767px) {
          .admin-root {
            display: block !important;
            height: auto !important;
            min-height: 100vh;
            overflow: visible !important;
          }
          .admin-mobile-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            position: sticky;
            top: 0;
            z-index: 40;
            height: 54px;
            padding: 0 16px;
            background: #ffffff;
            border-bottom: 1px solid #f0f0f0;
          }
          .admin-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            height: 100dvh !important;
            width: 264px !important;
            max-width: 82vw;
            z-index: 60;
            transform: translateX(-100%);
            transition: transform 0.24s ease;
            box-shadow: 0 0 48px rgba(0,0,0,0.18);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-sidebar-close {
            display: flex !important;
            position: absolute;
            top: 16px;
            right: 14px;
            border: none;
            background: none;
            padding: 4px;
            cursor: pointer;
            color: #6b7280;
            z-index: 2;
          }
          .admin-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(17,24,39,0.4);
            z-index: 55;
          }
          .admin-main {
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  )
}
