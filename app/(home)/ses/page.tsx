import { createClient } from '@supabase/supabase-js'
import SharedHero from '@/components/SharedHero'
import AudioPlayer from '@/components/AudioPlayer'
import ShareButtons from '@/components/ShareButtons'
import { audioPublicUrl, formatDuration, coverUrl } from '@/lib/audio'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const metadata: Metadata = {
  title: 'Podcast — tr.dincer',
  description: 'Yalnız İşler Ofisi — sesli yazılar ve kısa sesli notlar.',
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
  const [{ data: episodes }, { data: coverRow }] = await Promise.all([
    supabase
      .from('audio_episodes')
      .select('id, title, description, audio_path, duration, post_slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'podcast_cover')
      .maybeSingle(),
  ])

  const list = (episodes || []) as Episode[]
  const cover = coverUrl(coverRow?.value)

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero
          title="Podcast"
          description="Yalnız İşler Ofisi"
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
                  {/* Üst: kapak + metin */}
                  <div className="ses-head" style={{ display: 'flex', gap: '18px', marginBottom: '16px' }}>
                    <a href={`/ses/${ep.id}`} style={{ flexShrink: 0, lineHeight: 0 }}>
                      <img
                        src={cover}
                        alt=""
                        className="ses-cover"
                        style={{ width: '92px', height: '92px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f0f0f0' }}
                      />
                    </a>
                    <div style={{ minWidth: 0 }}>
                      {/* Meta */}
                      <div style={{
                        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
                        marginBottom: '8px',
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
                        fontSize: '21px', lineHeight: '28px', fontWeight: 700,
                        letterSpacing: '-0.01em', margin: '0 0 6px',
                      }}>
                        <a href={`/ses/${ep.id}`} className="ses-title" style={{ color: '#111827', textDecoration: 'none' }}>
                          {ep.title}
                        </a>
                      </h2>

                      {/* Açıklama */}
                      {ep.description && (
                        <p style={{ fontSize: '15px', lineHeight: '23px', color: '#5f5e5e', margin: 0 }}>
                          {ep.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Oynatıcı */}
                  <AudioPlayer src={audioPublicUrl(ep.audio_path)} duration={ep.duration} episodeId={ep.id} />

                  {/* Paylaş + ilgili yazı */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '14px' }}>
                    <ShareButtons url={`https://tr.dincer.co/ses/${ep.id}`} title={ep.title} />
                    {ep.post_slug && (
                      <a href={`/${ep.post_slug}`} style={{
                        fontSize: '13px', fontWeight: 600, color: '#d00202', textDecoration: 'none',
                      }}>
                        İlgili yazıyı oku →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`.ses-title:hover { color: #d00202 !important; }`}</style>
    </div>
  )
}

export const dynamic = 'force-dynamic'
