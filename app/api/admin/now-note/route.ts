import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { note } = await req.json()
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'now_note', value: note ?? '' }, { onConflict: 'key' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('now-note error:', err)
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 })
  }
}
