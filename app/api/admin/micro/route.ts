import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/micro — yeni mikro yazı
export async function POST(req: NextRequest) {
  const { content, pinned } = await req.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'İçerik boş olamaz.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('micro_posts')
    .insert({ content: content.trim(), pinned: pinned ?? false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
