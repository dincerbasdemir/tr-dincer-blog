import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Kategoriye göre arka plan rengi
const categoryColors: Record<string, { bg: string; accent: string }> = {
  'Günlük':           { bg: '#1a1a2e', accent: '#e94560' },
  'Teknoloji':        { bg: '#0f3460', accent: '#e94560' },
  'Pazarlama':        { bg: '#16213e', accent: '#f5a623' },
  'Dijital Pazarlama':{ bg: '#16213e', accent: '#f5a623' },
  'Genel Kültür':     { bg: '#1b1f3a', accent: '#7c6af7' },
  'Tasarım':          { bg: '#0d1b2a', accent: '#00b4d8' },
  'Yapay Zeka':       { bg: '#0a0a1a', accent: '#a78bfa' },
}
const defaultTheme = { bg: '#111827', accent: '#6366f1' }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title    = searchParams.get('title')    || 'tr.dincer'
  const category = searchParams.get('category') || ''

  const theme = categoryColors[category] || defaultTheme

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: theme.bg,
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Accent çizgi üstte */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '6px',
          backgroundColor: theme.accent,
        }} />

        {/* Dekoratif daire */}
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          right: '-120px',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          border: `2px solid ${theme.accent}22`,
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          right: '-60px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          border: `2px solid ${theme.accent}44`,
          display: 'flex',
        }} />

        {/* Üst: site adı + kategori */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            tr.dincer
          </span>
          {category && (
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.accent,
              backgroundColor: `${theme.accent}18`,
              padding: '8px 20px',
              borderRadius: '999px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {category}
            </span>
          )}
        </div>

        {/* Başlık */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flex: 1,
          justifyContent: 'center',
        }}>
          <div style={{
            width: '56px',
            height: '4px',
            backgroundColor: theme.accent,
            borderRadius: '2px',
          }} />
          <p style={{
            fontSize: title.length > 60 ? '52px' : '64px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: 0,
            maxWidth: '900px',
          }}>
            {title}
          </p>
        </div>

        {/* Alt: dincer.co */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 800,
            color: '#fff',
          }}>
            D
          </div>
          <span style={{ fontSize: '18px', color: '#ffffff88', fontWeight: 500 }}>
            tr.dincer.co
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
