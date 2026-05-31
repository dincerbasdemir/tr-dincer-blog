import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { category, title, subtitle, url, sort_order } = await req.json()

    if (!category || !title) {
      return NextResponse.json({ error: 'Kategori ve başlık zorunlu.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('now_items')
      .insert({ category, title, subtitle: subtitle || null, url: url || null, sort_order: sort_order ?? 0 })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, item: data })
  } catch (err: any) {
    console.error('Now POST error:', err)
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 })
  }
}
