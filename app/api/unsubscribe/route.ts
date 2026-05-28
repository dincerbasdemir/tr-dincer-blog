import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse('<p>Geçersiz bağlantı.</p>', { headers: { 'Content-Type': 'text/html' } })
  }

  const { error } = await supabase
    .from('subscribers')
    .update({ active: false })
    .eq('token', token)

  if (error) {
    return new NextResponse('<p>Bir hata oluştu.</p>', { headers: { 'Content-Type': 'text/html' } })
  }

  return new NextResponse(`
    <html><head><meta charset="utf-8"><title>Abonelik İptal</title></head>
    <body style="font-family:sans-serif;max-width:400px;margin:80px auto;text-align:center;color:#374151">
      <h2>Aboneliğiniz iptal edildi.</h2>
      <p>Artık yeni yazı bildirimleri almayacaksınız.</p>
      <a href="https://tr.dincer.co" style="color:#d00202">tr.dincer.co</a>
    </body></html>
  `, { headers: { 'Content-Type': 'text/html' } })
}
