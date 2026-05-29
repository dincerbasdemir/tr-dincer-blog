import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { buildEmail } from '../notify/template'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-notify-secret')
  if (authHeader !== process.env.NOTIFY_SECRET) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
  }

  const testEmail = process.env.ADMIN_TEST_EMAIL
  if (!testEmail) {
    return NextResponse.json({ error: 'ADMIN_TEST_EMAIL env değişkeni tanımlı değil.' }, { status: 500 })
  }

  const { postTitle, postSlug, postExcerpt, postFeaturedImage } = await req.json()

  const postUrl = `https://tr.dincer.co/${postSlug || 'test'}`

  const { data, error } = await resend.emails.send({
    from: 'tr.dincer <bildirim@dincer.co>',
    to: testEmail,
    subject: `[TEST] ${postTitle || 'Test Yazısı'}`,
    html: buildEmail({
      postTitle: postTitle || 'Test Yazısı Başlığı',
      postExcerpt: postExcerpt || 'Bu bir test emailidir. Gerçek bir yazı bildirimi değildir.',
      postFeaturedImage,
      postUrl,
      unsubscribeToken: 'test-token',
    }),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, sentTo: testEmail })
}
