'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        backgroundColor: '#111827',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        maxWidth: '560px',
        width: 'calc(100% - 32px)',
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
      }}
    >
      <p style={{ fontSize: '13px', lineHeight: '20px', color: 'rgba(255,255,255,0.75)', margin: 0, flex: 1 }}>
        Bu site yalnızca temel işlevler için çerez kullanmaktadır.{' '}
        <a
          href="/gizlilik-politikasi"
          style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          Gizlilik Politikası
        </a>
      </p>

      <button
        onClick={accept}
        style={{
          flexShrink: 0,
          backgroundColor: '#ffffff',
          color: '#111827',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 18px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Anladım
      </button>
    </div>
  )
}
