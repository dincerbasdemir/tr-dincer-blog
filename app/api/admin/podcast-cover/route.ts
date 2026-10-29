import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/podcast-cover — podcast kapağını kaydet (boş = varsayılana dön)
export async function POST(req: NextRequest) {
  try {
    const { cover } = await req.json()
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'podcast_cover', value: cover ?? '' }, { onConflict: 'key' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('podcast-cover error:', err)
    return NextResponse.json({ error: 'Kapak kaydedilemedi.' }, { status: 500 })
  }
}
