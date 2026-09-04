import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/subscribers — manuel abone ekle
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 })
    }

    const normalized = email.trim().toLowerCase()
    const supabase = createAdminClient()

    // Zaten var mı?
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, active')
      .eq('email', normalized)
      .single()

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ error: 'Bu e-posta zaten aktif abone.' }, { status: 409 })
      }
      // Pasifse yeniden aktifleştir
      const { data, error } = await supabase
        .from('subscribers')
        .update({ active: true, subscribed_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select('id, email, active, subscribed_at')
        .single()
      if (error) throw error
      return NextResponse.json({ subscriber: data, reactivated: true })
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert({ email: normalized, active: true, subscribed_at: new Date().toISOString() })
      .select('id, email, active, subscribed_at')
      .single()

    if (error) throw error
    return NextResponse.json({ subscriber: data })
  } catch (err: any) {
    console.error('Manuel abone ekleme hatası:', err)
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 })
  }
}
