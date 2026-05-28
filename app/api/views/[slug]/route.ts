import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  if (!slug) {
    return NextResponse.json({ error: 'Slug gerekli.' }, { status: 400 })
  }

  const { error } = await supabase.rpc('increment_views', { post_slug: slug })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
