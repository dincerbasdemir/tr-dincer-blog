import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// DELETE /api/admin/audio/[id] — bölümü ve ses dosyasını sil
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()

  const { data: ep } = await supabase
    .from('audio_episodes')
    .select('audio_path')
    .eq('id', params.id)
    .single()

  if (ep?.audio_path) {
    await supabase.storage.from('audio').remove([ep.audio_path])
  }

  const { error } = await supabase.from('audio_episodes').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// PATCH /api/admin/audio/[id] — metadata düzenle / yayınla-gizle
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const updates: { title?: string; description?: string | null; post_slug?: string | null; published?: boolean } = {}

  if (typeof body.title === 'string') {
    if (!body.title.trim()) return NextResponse.json({ error: 'Başlık boş olamaz.' }, { status: 400 })
    updates.title = body.title.trim()
  }
  if ('description' in body) updates.description = body.description?.trim() || null
  if ('post_slug' in body) updates.post_slug = body.post_slug?.trim() || null
  if (typeof body.published === 'boolean') updates.published = body.published

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Güncellenecek alan yok.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('audio_episodes').update(updates).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
