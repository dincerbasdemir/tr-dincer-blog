import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/admin/pages — list all pages
export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, title, slug, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/pages — create page
export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('pages')
    .insert({
      title: body.title,
      slug: body.slug,
      content: body.content || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
