import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// DELETE /api/admin/micro/[id] — sil
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('micro_posts')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// PATCH /api/admin/micro/[id] — pin/unpin toggle veya içerik düzenle
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const supabase = createAdminClient()

  const updates: { pinned?: boolean; content?: string } = {}
  if (typeof body.pinned === 'boolean') updates.pinned = body.pinned
  if (typeof body.content === 'string') {
    if (!body.content.trim()) {
      return NextResponse.json({ error: 'İçerik boş olamaz.' }, { status: 400 })
    }
    updates.content = body.content.trim()
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Güncellenecek alan yok.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('micro_posts')
    .update(updates)
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
