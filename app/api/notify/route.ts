import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { buildEmail } from './template'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-notify-secret')
    if (authHeader !== process.env.NOTIFY_SECRET) {
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
    }

    const { postTitle, postSlug, postExcerpt, postFeaturedImage } = await req.json()

    if (!postTitle || !postSlug) {
      return NextResponse.json({ error: 'Yazı bilgileri eksik.' }, { status: 400 })
    }

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email, token')
      .eq('active', true)

    if (error) throw error
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'Abone yok.' })
    }

    const postUrl = `https://tr.dincer.co/${postSlug}`

    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        resend.emails.send({
          from: 'tr.dincer <bildirim@dincer.co>',
          to: sub.email,
          subject: postTitle,
          html: buildEmail({
            postTitle,
            postExcerpt,
            postFeaturedImage,
            postUrl,
            unsubscribeToken: sub.token,
          }),
        })
      )
    )

    const sent = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({ success: true, sent, failed, total: subscribers.length })
  } catch (err: any) {
    console.error('Notify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
