'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MAX_CHARS = 500

export default function MicroComposer() {
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const router = useRouter()

  const remaining = MAX_CHARS - content.length
  const isOverLimit = remaining < 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || isOverLimit) return
    setStatus('loading')

    try {
      const res = await fetch('/api/admin/micro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, pinned }),
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Hata')
      }

      setContent('')
      setPinned(false)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
      router.refresh()
    } catch (err: any) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #f0f0f0',
      padding: '24px',
      marginBottom: '28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Ne düşünüyorsun?"
          rows={4}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '16px',
            lineHeight: '26px',
            color: '#1b1c1c',
            fontFamily: 'inherit',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
          }}
        />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f3f4f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Karakter sayacı */}
            <span style={{
              fontSize: '13px',
              color: isOverLimit ? '#d00202' : remaining < 50 ? '#f59e0b' : '#9ca3af',
              fontWeight: isOverLimit ? 700 : 400,
            }}>
              {remaining}
            </span>

            {/* Pin toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={pinned}
                onChange={e => setPinned(e.target.checked)}
                style={{ width: '14px', height: '14px', accentColor: '#d00202', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Sabitle</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !content.trim() || isOverLimit}
            style={{
              padding: '9px 22px',
              backgroundColor: status === 'success' ? '#16a34a' : '#111827',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              cursor: status === 'loading' || !content.trim() || isOverLimit ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' || (!content.trim() && status !== 'success') ? 0.6 : 1,
              transition: 'background 0.2s',
            }}
          >
            {status === 'loading' ? 'Gönderiliyor…' : status === 'success' ? '✓ Gönderildi' : 'Gönder'}
          </button>
        </div>

        {status === 'error' && (
          <p style={{ fontSize: '12px', color: '#d00202', margin: '8px 0 0' }}>
            Bir hata oluştu, tekrar dene.
          </p>
        )}
      </form>
    </div>
  )
}
