import { createClient } from '@supabase/supabase-js'
import SharedHero from '@/components/SharedHero'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const metadata: Metadata = {
  title: 'Şu An — tr.dincer',
  description: 'Ne okuyorum, ne dinliyorum, ne üzerinde çalışıyorum.',
}

const CATEGORY_META = {
  reading:   { label: 'Okuyorum',     emoji: '📖' },
  listening: { label: 'Dinliyorum',   emoji: '🎵' },
  working:   { label: 'Çalışıyorum',  emoji: '💻' },
  watching:  { label: 'İzliyorum',    emoji: '📺' },
} as const

type Category = keyof typeof CATEGORY_META

type NowItem = {
  id: string
  category: Category
  title: string
  subtitle: string | null
  url: string | null
}

const CATEGORY_ORDER: Category[] = ['working', 'reading', 'listening', 'watching']

export default async function NowPage() {
  const { data: items } = await supabase
    .from('now_items')
    .select('id, category, title, subtitle, url, sort_order')
    .order('sort_order')
    .order('created_at', { ascending: false })

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = (items || []).filter(i => i.category === cat)
    return acc
  }, {} as Record<Category, NowItem[]>)

  const hasAny = (items || []).length > 0

  // Format date in Turkish
  const now = new Date()
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title="Şu an"
          description="Ne üzerinde çalışıyorum, ne okuyorum, ne dinliyorum."
          activeTab="/now"
        />

        <div className="px-5 pb-20 sm:px-16">

          {/* Last updated */}
          <p style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '48px' }}>
            Son güncelleme: {dateStr} · <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" style={{ color: '#d1d5db', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Bu nedir?</a>
          </p>

          {!hasAny && (
            <p style={{ fontSize: '15px', color: '#9ca3af' }}>Yakında eklenecek.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {CATEGORY_ORDER.map(cat => {
              const catItems = grouped[cat]
              if (!catItems || catItems.length === 0) return null
              const meta = CATEGORY_META[cat]
              return (
                <section key={cat}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '20px',
                  }}>
                    <span style={{ fontSize: '20px', lineHeight: 1 }}>{meta.emoji}</span>
                    <h2 style={{
                      fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#9ca3af', margin: 0,
                    }}>
                      {meta.label}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {catItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          borderLeft: '2px solid #f3f4f6',
                          paddingLeft: '16px',
                        }}
                      >
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '17px',
                              fontWeight: 600,
                              color: '#111827',
                              textDecoration: 'none',
                              letterSpacing: '-0.01em',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.title}
                            <span style={{ color: '#d00202', marginLeft: '4px', fontSize: '14px' }}>↗</span>
                          </a>
                        ) : (
                          <span style={{
                            fontSize: '17px',
                            fontWeight: 600,
                            color: '#111827',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.4,
                          }}>
                            {item.title}
                          </span>
                        )}
                        {item.subtitle && (
                          <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '3px' }}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
