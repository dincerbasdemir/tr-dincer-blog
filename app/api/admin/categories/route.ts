import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { turkishSlugify } from '@/lib/utils'

// GET /api/admin/categories — list all categories
export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/categories — create category
export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createAdminClient()

  const slug = turkishSlugify(body.name)

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: body.name, slug })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
