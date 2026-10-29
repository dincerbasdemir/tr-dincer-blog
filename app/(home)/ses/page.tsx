import { createClient } from '@supabase/supabase-js'
import SharedHero from '@/components/SharedHero'
import AudioPlayer from '@/components/AudioPlayer'
import { audioPublicUrl, formatDuration } from '@/lib/audio'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const metadata: Metadata = {
  title: 'Ses — tr.dincer',
  description: 'Sesli yazılar ve kısa sesli notlar.',
}

type Episode = {
  id: string
  title: string
  description: string | null
  audio_path: string
  duration: number | null
  post_slug: string | null
  created_at: string
}

export default async function SesPage() {
  const { data: episodes } = await supabase
    .from('audio_episodes')
    .select('id, title, description, audio_path, duration, post_slug, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const list = (episodes || []) as Episode[]

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title="Ses"
          description="Sesli yazılar ve kısa sesli notlar."
          activeTab="/ses"
        />

        <div className="px-5 pb-20 sm:px-16">
          {list.length === 0 ? (
            <p style={{ fontSize: '15px', color: '#9ca3af', padding: '32px 0' }}>
              Yakında ilk bölümler burada olacak.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingTop: '8px' }}>
              {list.map(ep => (
                <article key={ep.id} style={{ borderTop: '1px solid #f3f4f6', paddingTop: '28px' }}>
                  {/* Meta */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
                    marginBottom: '10px',
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: '#adb5bd',
                  }}>
                    <span>{format(new Date(ep.created_at), 'd MMMM yyyy', { locale: tr })}</span>
                    {ep.duration ? (
                      <>
                        <span style={{ color: '#d1d5db' }}>•</span>
                        <span>{formatDuration(ep.duration)}</span>
                      </>
                    ) : null}
                  </div>

                  {/* Başlık */}
                  <h2 style={{
                    fontSize: '22px', lineHeight: '30px', fontWeight: 700,
                    color: '#111827', letterSpacing: '-0.01em', margin: '0 0 8px',
                  }}>
                    {ep.title}
                  </h2>

                  {/* Açıklama */}
                  {ep.description && (
                    <p style={{ fontSize: '15px', lineHeight: '24px', color: '#5f5e5e', margin: '0 0 16px' }}>
                      {ep.description}
                    </p>
                  )}

                  {/* Oynatıcı */}
                  <AudioPlayer src={audioPublicUrl(ep.audio_path)} duration={ep.duration} />

                  {/* İlgili yazı linki */}
                  {ep.post_slug && (
                    <a href={`/${ep.post_slug}`} style={{
                      display: 'inline-block', marginTop: '12px',
                      fontSize: '13px', fontWeight: 600, color: '#d00202', textDecoration: 'none',
                    }}>
                      İlgili yazıyı oku →
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
