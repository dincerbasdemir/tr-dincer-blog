import { createClient } from '@supabase/supabase-js'
import SharedHero from '@/components/SharedHero'
import AudioPlayer from '@/components/AudioPlayer'
import ShareButtons from '@/components/ShareButtons'
import { audioPublicUrl, coverUrl, formatDuration } from '@/lib/audio'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const FIELDS = 'id, slug, title, description, audio_path, duration, post_slug, created_at, published'

// param slug ya da (eski linkler için) uuid olabilir
async function getEpisode(param: string) {
  let { data } = await supabase.from('audio_episodes').select(FIELDS).eq('slug', param).maybeSingle()
  if (!data && UUID_RE.test(param)) {
    const byId = await supabase.from('audio_episodes').select(FIELDS).eq('id', param).maybeSingle()
    data = byId.data
  }
  // yayınlanmamış veya bir yazıya bağlı (podcast değil) bölümleri gösterme
  if (!data || !data.published || data.post_slug) return null
  return data
}

async function getCover() {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'podcast_cover')
    .maybeSingle()
  return coverUrl(data?.value)
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const ep = await getEpisode(params.id)
  if (!ep) return { title: 'Bölüm bulunamadı' }
  const cover = await getCover()
  return {
    title: `${ep.title} — tr.dincer Podcast`,
    description: ep.description || ep.title,
    openGraph: {
      title: ep.title,
      description: ep.description || ep.title,
      type: 'article',
      images: [cover],
    },
    twitter: {
      card: 'summary_large_image',
      title: ep.title,
      description: ep.description || ep.title,
      images: [cover],
    },
  }
}

export default async function EpisodePage({ params }: { params: { id: string } }) {
  const [ep, cover] = await Promise.all([getEpisode(params.id), getCover()])
  if (!ep) notFound()

  const shareUrl = `https://tr.dincer.co/ses/${ep.slug || ep.id}`

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="max-w-[925px] mx-auto" style={{ backgroundColor: '#ffffff', marginTop: '10px' }}>

        <SharedHero title="Podcast" description="Yalnız İşler Ofisi" activeTab="/ses" />

        <div className="px-5 pb-20 sm:px-16" style={{ paddingTop: '8px' }}>
          <a href="/ses" style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', textDecoration: 'none' }}>
            ← Tüm bölümler
          </a>

          {/* Üst: kapak + başlık */}
          <div className="ep-head" style={{ display: 'flex', alignItems: 'center', gap: '24px', margin: '24px 0 28px' }}>
            <img className="ep-cover" src={cover} alt="" style={{ width: '150px', height: '150px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '10px',
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#adb5bd',
              }}>
                <span>{format(new Date(ep.created_at), 'd MMMM yyyy', { locale: tr })}</span>
                {ep.duration ? (<><span style={{ color: '#d1d5db' }}>•</span><span>{formatDuration(ep.duration)}</span></>) : null}
              </div>
              <h1 className="ep-title" style={{ fontSize: '28px', lineHeight: '36px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
                {ep.title}
              </h1>
            </div>
          </div>

          {/* Oynatıcı */}
          <AudioPlayer src={audioPublicUrl(ep.audio_path)} duration={ep.duration} episodeId={ep.id} />

          {/* Paylaş */}
          <div style={{ marginTop: '16px' }}>
            <ShareButtons url={shareUrl} title={ep.title} />
          </div>

          {/* Açıklama */}
          {ep.description && (
            <p style={{ fontSize: '16px', lineHeight: '27px', color: '#374151', margin: '28px 0 0', whiteSpace: 'pre-wrap' }}>
              {ep.description}
            </p>
          )}

          {/* İlgili yazı */}
          {ep.post_slug && (
            <a href={`/${ep.post_slug}`} style={{ display: 'inline-block', marginTop: '20px', fontSize: '14px', fontWeight: 600, color: '#d00202', textDecoration: 'none' }}>
              İlgili yazıyı oku →
            </a>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px){
          .ep-head { gap: 16px !important; }
          .ep-cover { width: 118px !important; height: 118px !important; }
          .ep-title { font-size: 21px !important; line-height: 27px !important; }
        }
      `}</style>
    </div>
  )
}

export const dynamic = 'force-dynamic'
