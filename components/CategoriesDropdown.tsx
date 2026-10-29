'use client'

import { useState, useRef, useEffect } from 'react'

type Category = { name: string; slug: string }

export default function CategoriesDropdown({
  categories,
  active = false,
}: {
  categories: Category[]
  active?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function place() {
      const r = btnRef.current?.getBoundingClientRect()
      if (r) {
        const width = 220
        let left = r.left
        // ekrandan taşmasın
        if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12
        setPos({ top: r.bottom + 6, left: Math.max(12, left) })
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

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className="nav-pill cat-pill"
        aria-label="Kategoriler"
        style={{
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '11.5px',
          fontWeight: 700,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          color: '#ffffff',
          backgroundColor: '#111827',
          opacity: active || open ? 1 : 0.5,
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.15s',
        }}
      >
        {/* Masaüstü: metin + chevron */}
        <span className="cat-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          Kategoriler
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        {/* Mobil: hamburger ikonu */}
        <span className="cat-icon" style={{ display: 'none', alignItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </span>
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            width: '220px',
            zIndex: 1000,
            backgroundColor: '#ffffff',
            border: '1px solid #f0f0f0',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(17,24,39,0.12)',
            padding: '6px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {categories.map(cat => (
            <a
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                textDecoration: 'none',
              }}
              className="cat-item"
            >
              {cat.name}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .cat-item:hover { background-color: #f9fafb; color: #d00202; }
        @media (max-width: 600px) {
          .cat-pill { padding: 5px 9px !important; }
          .cat-label { display: none !important; }
          .cat-icon { display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
