import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/admin/pages/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PUT /api/admin/pages/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('pages')
    .update({
      title: body.title,
      slug: body.slug,
      content: body.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/admin/pages/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('pages').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
