'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
        setMessage('Abone oldunuz! Yeni yazılarda görüşürüz.')
        setEmail('')
      }
    } catch {
      setStatus('error')
      setMessage('Bağlantı hatası, tekrar deneyin.')
    }
  }

  return (
    <div style={{ backgroundColor: '#111827', padding: '48px 64px' }} className="px-5 py-10 sm:px-16 sm:py-14">
      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '10px' }}>
        Bülten
      </p>
      <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '8px' }}>
        Yeni yazılardan haberdar ol
      </h3>
      <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
        Yeni bir yazı yayınlandığında mail olarak göndereyim.
      </p>

      {status === 'success' ? (
        <p style={{ fontSize: '15px', color: '#86efac', fontWeight: 600 }}>✓ {message}</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '11px 16px',
              fontSize: '14px',
              border: '1px solid #374151',
              outline: 'none',
              color: '#ffffff',
              backgroundColor: '#1f2937',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '11px 24px',
              backgroundColor: '#ffffff',
              color: '#111827',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'loading' ? 'Kaydediliyor…' : 'Abone Ol'}
          </button>
          {status === 'error' && (
            <p style={{ width: '100%', fontSize: '13px', color: '#fca5a5', margin: '4px 0 0' }}>{message}</p>
          )}
        </form>
      )}
    </div>
  )
}
