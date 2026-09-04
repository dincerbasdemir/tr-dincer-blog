import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// DELETE /api/admin/subscribers/[id] — aboneyi kalıcı sil
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('subscribers').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// PATCH /api/admin/subscribers/[id] — aktif/pasif değiştir
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { active } = await req.json()
  if (typeof active !== 'boolean') {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('subscribers')
    .update({ active })
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
