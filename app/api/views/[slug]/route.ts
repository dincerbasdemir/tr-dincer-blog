import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function hashToken(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Admin girişi yapmış mı? (middleware ile aynı doğrulama)
async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('admin_auth')?.value
  if (!token) return false
  try {
    const expected = await hashToken(
      (process.env.ADMIN_PASSWORD || '') + ':' + (process.env.ADMIN_SECRET || 'secret')
    )
    return token === expected
  } catch {
    return false
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  if (!slug) {
    return NextResponse.json({ error: 'Slug gerekli.' }, { status: 400 })
  }

  // Admin kendi görüntülemelerini saymasın
  if (await isAdmin(req)) {
    return NextResponse.json({ success: true, skipped: 'admin' })
  }

  const { error } = await supabase.rpc('increment_views', { post_slug: slug })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
