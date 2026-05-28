import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    // Basit auth kontrolü
    const authHeader = req.headers.get('x-notify-secret')
    if (authHeader !== process.env.NOTIFY_SECRET) {
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
    }

    const { postTitle, postSlug, postExcerpt } = await req.json()

    if (!postTitle || !postSlug) {
      return NextResponse.json({ error: 'Yazı bilgileri eksik.' }, { status: 400 })
    }

    // Aktif aboneleri çek
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email, token')
      .eq('active', true)

    if (error) throw error
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'Abone yok.' })
    }

    const postUrl = `https://tr.dincer.co/${postSlug}`

    // Her aboneye mail gönder (batch olarak)
    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        resend.emails.send({
          from: 'tr.dincer <bildirim@tr.dincer.co>',
          to: sub.email,
          subject: `Yeni yazı: ${postTitle}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="margin:0;padding:0;background:#f5f5f5;font-family:'DM Sans',system-ui,sans-serif">
              <div style="max-width:560px;margin:40px auto;background:#ffffff;padding:48px 40px">

                <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:32px;letter-spacing:-0.01em">
                  tr.dincer
                </div>

                <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#adb5bd;margin:0 0 16px">
                  Yeni Yazı
                </p>

                <h1 style="font-size:26px;line-height:34px;font-weight:800;color:#111827;letter-spacing:-0.02em;margin:0 0 16px">
                  ${postTitle}
                </h1>

                ${postExcerpt ? `<p style="font-size:16px;line-height:26px;color:#374151;margin:0 0 32px">${postExcerpt}</p>` : ''}

                <a href="${postUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 24px;font-size:14px;font-weight:600;letter-spacing:0.01em">
                  Yazıyı Oku →
                </a>

                <hr style="border:none;border-top:1px solid #f0f0f0;margin:40px 0 24px">

                <p style="font-size:12px;color:#9ca3af;margin:0">
                  Bu maili almak istemiyorsanız <a href="https://tr.dincer.co/api/unsubscribe?token=${sub.token}" style="color:#d00202;text-decoration:none">aboneliğinizi iptal edebilirsiniz</a>.
                </p>
              </div>
            </body>
            </html>
          `,
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
