import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { buildWelcomeEmail } from '../notify/welcome-template'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 })
    }

    // Önce mevcut kaydı kontrol et (yeniden abone oluyor mu?)
    const { data: existing } = await supabase
      .from('subscribers')
      .select('token, active')
      .eq('email', email)
      .single()

    const { error } = await supabase
      .from('subscribers')
      .upsert({ email, active: true, subscribed_at: new Date().toISOString() }, { onConflict: 'email' })

    if (error) throw error

    // Token'ı al (upsert sonrası)
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('token')
      .eq('email', email)
      .single()

    // Sadece yeni abone olanlara hoş geldin maili gönder
    // (daha önce aktifken tekrar abone olan biri değilse)
    const isResubscribe = existing?.active === true

    if (!isResubscribe && subscriber?.token) {
      await resend.emails.send({
        from: 'tr.dincer <bildirim@dincer.co>',
        to: email,
        subject: 'Abone oldunuz — tr.dincer',
        html: buildWelcomeEmail(subscriber.token),
      })
    }

    return NextResponse.json({ success: true, message: 'Abone oldunuz!' })
  } catch (err: any) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 })
  }
}
