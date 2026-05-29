'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Bir hata oluştu.')
      } else {
        setStatus('success')
        setMessage('Abone oldunuz!')
        setEmail('')
      }
    } catch {
      setStatus('error')
      setMessage('Bağlantı hatası, tekrar deneyin.')
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '64px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center',
        }}
        className="subscribe-grid"
      >
        {/* ── Sol: Metin + Input ── */}
        <div>
          <h2 style={{
            fontSize: '32px',
            lineHeight: '40px',
            fontWeight: 800,
            color: '#1b1c1c',
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
          }}>
            Yeni yazılardan<br />haberdar ol
          </h2>
          <p style={{
            fontSize: '14px',
            lineHeight: '22px',
            color: '#9ca3af',
            margin: '0 0 36px',
          }}>
            Yeni bir yazı yayınlandığında mail olarak göndereyim.{' '}
            <a href="/gizlilik-politikasi" style={{ color: '#9ca3af', textDecoration: 'underline' }}>
              Gizlilik Politikası
            </a>
          </p>

          {status === 'success' ? (
            <p style={{ fontSize: '15px', color: '#16a34a', fontWeight: 600 }}>
              ✓ {message}
            </p>
          ) : (
            <>
              <label style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: 700,
                color: '#1b1c1c',
                marginBottom: '10px',
                letterSpacing: '-0.01em',
              }}>
                E-posta
              </label>
              <input
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  display: 'block',
                  width: '100%',
                  border: 'none',
                  borderBottom: '1.5px solid #d1d5db',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#1b1c1c',
                  padding: '8px 0',
                  backgroundColor: 'transparent',
                  boxSizing: 'border-box',
                }}
              />
              {status === 'error' && (
                <p style={{ fontSize: '12px', color: '#d00202', marginTop: '8px' }}>{message}</p>
              )}
            </>
          )}
        </div>

        {/* ── Sağ: İkon + Buton ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#d00202',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 12px rgba(208,2,2,0.08)',
          }}>
            <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, textAlign: 'center' }}>
            E-postanı gir ve abone ol
          </p>

          {status !== 'success' && (
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '14px 40px',
                backgroundColor: '#d00202',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 800,
                border: 'none',
                borderRadius: '999px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.01em',
                opacity: status === 'loading' ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {status === 'loading' ? 'Kaydediliyor…' : 'Abone Ol'}
            </button>
          )}
        </div>
      </form>

      <style>{`
        @media (max-width: 640px) {
          .subscribe-grid {
            grid-template-columns: 1fr !important;
            padding: 48px 24px !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  )
}
