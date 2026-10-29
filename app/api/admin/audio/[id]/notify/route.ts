import { createAdminClient } from '@/lib/supabase-admin'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { buildAudioEmail } from '../../../../notify/audio-template'

const resend = new Resend(process.env.RESEND_API_KEY)

function absoluteCover(cover?: string | null): string {
  if (cover && cover.trim()) {
    return cover.startsWith('http') ? cover : `https://tr.dincer.co${cover}`
  }
  // Email'lerde SVG çalışmaz → PNG varsayılan
  return 'https://tr.dincer.co/podcast-cover.png'
}

// POST /api/admin/audio/[id]/notify — bölümü e-posta abonelerine gönder
// body { test: true } → yalnızca ADMIN_TEST_EMAIL'e gönderir
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}))
    const isTest = body?.test === true

    const supabase = createAdminClient()

    const { data: ep } = await supabase
      .from('audio_episodes')
      .select('id, title, description, published')
      .eq('id', params.id)
      .maybeSingle()

    if (!ep) return NextResponse.json({ error: 'Bölüm bulunamadı.' }, { status: 404 })
    if (!isTest && !ep.published) return NextResponse.json({ error: 'Önce bölümü yayınla.' }, { status: 400 })

    const { data: coverRow } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'podcast_cover')
      .maybeSingle()
    const cover = absoluteCover(coverRow?.value)
    const listenUrl = `https://tr.dincer.co/ses/${ep.id}`

    // ── Test: sadece ADMIN_TEST_EMAIL'e ──
    if (isTest) {
      const to = process.env.ADMIN_TEST_EMAIL
      if (!to) return NextResponse.json({ error: 'ADMIN_TEST_EMAIL tanımlı değil.' }, { status: 400 })
      await resend.emails.send({
        from: 'tr.dincer <bildirim@dincer.co>',
        to,
        subject: `[TEST] 🎧 ${ep.title}`,
        html: buildAudioEmail({
          title: ep.title,
          description: ep.description || undefined,
          coverUrl: cover,
          listenUrl,
          unsubscribeToken: 'test',
        }),
      })
      return NextResponse.json({ success: true, test: true, to })
    }

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email, token')
      .eq('active', true)
    if (error) throw error
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'Abone yok.' })
    }

    const results = await Promise.allSettled(
      subscribers.map(sub =>
        resend.emails.send({
          from: 'tr.dincer <bildirim@dincer.co>',
          to: sub.email,
          subject: `🎧 ${ep.title}`,
          html: buildAudioEmail({
            title: ep.title,
            description: ep.description || undefined,
            coverUrl: cover,
            listenUrl,
            unsubscribeToken: sub.token,
          }),
        })
      )
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({ success: true, sent, failed, total: subscribers.length })
  } catch (err: any) {
    console.error('Audio notify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
