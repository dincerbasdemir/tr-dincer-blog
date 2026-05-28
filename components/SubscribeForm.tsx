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
    <div style={{
      borderTop: '1px solid #f0f0f0',
      paddingTop: '40px',
      marginTop: '40px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#adb5bd', marginBottom: '10px' }}>
        Bülten
      </p>
      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em', marginBottom: '8px' }}>
        Yeni yazılardan haberdar ol
      </h3>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
        Yeni bir yazı yayınlandığında mail olarak göndereyim.
      </p>

      {status === 'success' ? (
        <p style={{ fontSize: '15px', color: '#111827', fontWeight: 600 }}>✓ {message}</p>
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
              padding: '10px 14px',
              fontSize: '14px',
              border: '1px solid #e5e7eb',
              outline: 'none',
              color: '#111827',
              backgroundColor: '#ffffff',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '10px 20px',
              backgroundColor: '#111827',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'loading' ? 'Kaydediliyor…' : 'Abone Ol'}
          </button>
          {status === 'error' && (
            <p style={{ width: '100%', fontSize: '13px', color: '#d00202', margin: '4px 0 0' }}>{message}</p>
          )}
        </form>
      )}
    </div>
  )
}
