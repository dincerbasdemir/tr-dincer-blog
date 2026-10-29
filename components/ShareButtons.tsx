'use client'

import { useState, useRef, useEffect } from 'react'

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function place() {
      const r = btnRef.current?.getBoundingClientRect()
      if (r) {
        const width = 230
        let left = r.left
        if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12
        setPos({ top: r.bottom + 8, left: Math.max(12, left) })
      }
    }
    place()
    function onDown(e: MouseEvent) {
      const t = e.target as Node
      if (btnRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    function onScroll() { setOpen(false) }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('resize', onScroll)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard yoksa sessizce geç */
    }
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + '\n\n' + url)}`

  const item: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '8px',
    fontSize: '14px', fontWeight: 500, color: '#374151',
    textDecoration: 'none', cursor: 'pointer',
    width: '100%', border: 'none', background: 'none', textAlign: 'left',
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '8px 16px', borderRadius: '999px',
          border: '1px solid #e5e7eb', backgroundColor: '#ffffff',
          fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer',
        }}
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Paylaş
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed', top: pos.top, left: pos.left, width: '230px', zIndex: 1000,
            backgroundColor: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(17,24,39,0.12)', padding: '6px',
          }}
        >
          <button onClick={copyLink} className="share-item" style={item}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={copied ? '#16a34a' : '#6b7280'} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span style={{ color: copied ? '#16a34a' : '#374151', fontWeight: copied ? 600 : 500 }}>
              {copied ? 'Kopyalandı ✓' : 'Bağlantıyı kopyala'}
            </span>
          </button>

          <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="share-item" style={item}>
            <svg width="16" height="16" fill="#25D366" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.615z"/>
            </svg>
            WhatsApp
          </a>

          <a href={xUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="share-item" style={item}>
            <svg width="14" height="14" fill="#000000" viewBox="0 0 24 24" style={{ margin: '0 1px' }}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </a>

          <a href={fbUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="share-item" style={item}>
            <svg width="16" height="16" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>

          <a href={mailUrl} onClick={() => setOpen(false)} className="share-item" style={item}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Mail
          </a>
        </div>
      )}

      <style>{`.share-item:hover { background-color: #f9fafb; }`}</style>
    </>
  )
}
