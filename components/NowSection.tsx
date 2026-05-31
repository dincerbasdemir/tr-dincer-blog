type NowItem = {
  id: string
  category: 'reading' | 'listening' | 'working' | 'watching'
  title: string
  subtitle: string | null
  url: string | null
}

const CATEGORY_META = {
  reading:   { label: 'Okuyorum',    emoji: '📖' },
  listening: { label: 'Dinliyorum',  emoji: '🎵' },
  working:   { label: 'Çalışıyorum', emoji: '💻' },
  watching:  { label: 'İzliyorum',   emoji: '📺' },
}

export default function NowSection({ items }: { items: NowItem[] }) {
  if (!items || items.length === 0) return null

  // Show max 4 items, one per category if possible
  const seen = new Set<string>()
  const preview: NowItem[] = []
  for (const item of items) {
    if (!seen.has(item.category)) {
      seen.add(item.category)
      preview.push(item)
    }
    if (preview.length >= 4) break
  }

  return (
    <section style={{
      borderTop: '1px solid #f3f4f6',
      padding: '32px 0',
      margin: '0 20px',
    }} className="sm:mx-16">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '13px', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: '#9ca3af', margin: 0,
        }}>
          Şu An
        </h2>
        <a href="/now" style={{
          fontSize: '12px', color: '#d00202',
          textDecoration: 'none', fontWeight: 600,
        }}>
          Tümü →
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}
        className="now-grid">
        {preview.map(item => {
          const meta = CATEGORY_META[item.category]
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{meta.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                  {meta.label}
                </div>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827', textDecoration: 'none', display: 'block', lineHeight: 1.35 }}
                    className="now-item-title">
                    {item.title}
                  </a>
                ) : (
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827', display: 'block', lineHeight: 1.35 }}>
                    {item.title}
                  </span>
                )}
                {item.subtitle && (
                  <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '2px' }}>{item.subtitle}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .now-grid { grid-template-columns: 1fr !important; }
        }
        .now-item-title:hover { color: #d00202 !important; }
      `}</style>
    </section>
  )
}
