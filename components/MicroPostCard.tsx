'use client'

import { useState } from 'react'

const COLLAPSE_THRESHOLD = 400 // karakter (HTML tag'leri hariç)

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Az önce'
  if (mins < 60) return `${mins} dakika önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} gün önce`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} hafta önce`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} ay önce`
  return `${Math.floor(days / 365)} yıl önce`
}

export default function MicroPostCard({
  post,
}: {
  post: { id: string; content: string; created_at: string; pinned: boolean }
}) {
  const plainText = post.content.replace(/<[^>]*>/g, '')
  const isLong = plainText.length > COLLAPSE_THRESHOLD
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: post.pinned ? '1px solid rgba(208,2,2,0.25)' : '1px solid #f0f0f0',
        borderRadius: '12px',
        padding: '20px 24px',
        position: 'relative',
      }}
    >
      {/* Pinned badge */}
      {post.pinned && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '10px',
          fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.07em',
          color: '#d00202',
        }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
          </svg>
          Sabitlenmiş
        </div>
      )}

      {/* Content */}
      <div
        className="micro-content"
        style={{
          fontSize: '16px',
          lineHeight: '27px',
          color: '#1b1c1c',
          wordBreak: 'break-word',
          overflow: isLong && !expanded ? 'hidden' : 'visible',
          display: isLong && !expanded ? '-webkit-box' : 'block',
          WebkitLineClamp: isLong && !expanded ? 6 : undefined,
          WebkitBoxOrient: isLong && !expanded ? 'vertical' : undefined,
        } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Expand toggle */}
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            display: 'block', marginTop: '6px',
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', color: '#d00202',
            fontSize: '13px', fontWeight: 600,
          }}
        >
          {expanded ? '↑ Daralt' : '↓ Devamını Oku'}
        </button>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
          {relativeTime(post.created_at)}
        </span>
      </div>
    </div>
  )
}
