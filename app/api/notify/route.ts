import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

function buildEmail(params: {
  postTitle: string
  postExcerpt?: string
  postFeaturedImage?: string
  postUrl: string
  unsubscribeToken: string
}) {
  const { postTitle, postExcerpt, postFeaturedImage, postUrl, unsubscribeToken } = params
  const unsubscribeUrl = `https://tr.dincer.co/api/unsubscribe?token=${unsubscribeToken}`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${postTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;-webkit-font-smoothing:antialiased">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f2f2f2">
  <tr>
    <td align="center" style="padding:40px 16px">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#111827;padding:22px 40px;border-radius:12px 12px 0 0">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td>
                  <span style="font-family:'DM Sans',system-ui,sans-serif;font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.02em">tr.dincer</span>
                </td>
                <td align="right">
                  <span style="font-family:'DM Sans',system-ui,sans-serif;font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em">Bülten</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td style="background-color:#ffffff;padding:40px 40px 36px">

            <!-- Badge -->
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px">
              <tr>
                <td style="background-color:#fef2f2;border-radius:999px;padding:5px 14px">
                  <span style="font-family:'DM Sans',system-ui,sans-serif;font-size:11px;font-weight:700;color:#d00202;text-transform:uppercase;letter-spacing:0.07em">&#10022; &nbsp;Yeni Yaz&#305;</span>
                </td>
              </tr>
            </table>

            <!-- Title -->
            <h1 style="font-family:'DM Sans',system-ui,sans-serif;font-size:30px;line-height:38px;font-weight:800;color:#111827;letter-spacing:-0.03em;margin:0 0 16px;padding:0">
              ${postTitle}
            </h1>

            <!-- Excerpt -->
            ${postExcerpt
              ? `<p style="font-family:'DM Sans',system-ui,sans-serif;font-size:16px;line-height:28px;color:#6b7280;margin:0 0 32px;padding:0">${postExcerpt}</p>`
              : '<div style="height:24px"></div>'
            }

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="background-color:#111827;border-radius:8px">
                  <a href="${postUrl}" style="font-family:'DM Sans',system-ui,sans-serif;display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.01em">
                    Yaz&#305;y&#305; Oku &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${postFeaturedImage ? `
        <!-- FEATURED IMAGE -->
        <tr>
          <td style="background-color:#ffffff;padding:0 40px 40px">
            <img src="${postFeaturedImage}" alt="" width="520" style="width:100%;max-width:520px;height:auto;display:block;border-radius:8px;border:none">
          </td>
        </tr>
        ` : ''}

        <!-- DIVIDER -->
        <tr>
          <td style="background-color:#ffffff;padding:0 40px">
            <div style="height:1px;background-color:#f0f0f0"></div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#ffffff;padding:24px 40px 32px;border-radius:0 0 12px 12px">
            <p style="font-family:'DM Sans',system-ui,sans-serif;font-size:12px;color:#9ca3af;margin:0 0 6px;padding:0">
              Bu ki&#351;isel bir blogtur.
              <a href="https://tr.dincer.co" style="color:#9ca3af;text-decoration:none">tr.dincer.co</a>
            </p>
            <p style="font-family:'DM Sans',system-ui,sans-serif;font-size:12px;color:#9ca3af;margin:0;padding:0">
              Bu maili almak istemiyorsan&#305;z
              <a href="${unsubscribeUrl}" style="color:#d00202;text-decoration:none">aboneli&#287;inizi iptal edebilirsiniz</a>.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

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
