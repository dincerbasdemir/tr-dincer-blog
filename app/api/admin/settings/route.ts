import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/admin/settings — fetch all site settings as flat object
export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const settings: Record<string, string> = {}
  for (const row of data || []) {
    settings[row.key] = row.value
  }

  return NextResponse.json(settings)
}

// PUT /api/admin/settings — upsert key-value pairs
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const supabase = createAdminClient()

  const rows = Object.entries(body).map(([key, value]) => ({
    key,
    value: (value as string) || '',
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
