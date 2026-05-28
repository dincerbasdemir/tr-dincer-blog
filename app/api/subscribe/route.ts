import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('subscribers')
      .upsert({ email, active: true }, { onConflict: 'email' })

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Abone oldunuz!' })
  } catch (err: any) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 })
  }
}
