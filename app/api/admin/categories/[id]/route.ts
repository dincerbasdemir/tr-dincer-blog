import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// PUT /api/admin/categories/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('categories')
    .update({ name: body.name, slug: body.slug })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/admin/categories/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('categories').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
