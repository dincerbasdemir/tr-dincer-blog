import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function hashToken(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('admin_auth')?.value
  if (!token) return false
  try {
    const expected = await hashToken((process.env.ADMIN_PASSWORD || '') + ':' + (process.env.ADMIN_SECRET || 'secret'))
    return token === expected
  } catch {
    return false
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  if (!id) return NextResponse.json({ error: 'id gerekli.' }, { status: 400 })

  // Admin kendi dinlemelerini saymasın
  if (await isAdmin(req)) {
    return NextResponse.json({ success: true, skipped: 'admin' })
  }

  // IP (Vercel: x-forwarded-for)
  const fwd = req.headers.get('x-forwarded-for')
  const ip = fwd ? fwd.split(',')[0].trim() : (req.ip || 'unknown')
  const ipHash = await hashToken(ip + ':' + (process.env.ADMIN_SECRET || 'salt'))

  // Aynı IP+bölüm daha önce sayıldıysa tekrar sayma
  const { data, error } = await supabase
    .from('audio_plays')
    .upsert({ episode_id: id, ip_hash: ipHash }, { onConflict: 'episode_id,ip_hash', ignoreDuplicates: true })
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Yeni bir kayıt eklendiyse (daha önce sayılmadıysa) sayacı artır
  if (data && data.length > 0) {
    await supabase.rpc('increment_plays', { ep_id: id })
    return NextResponse.json({ success: true, counted: true })
  }

  return NextResponse.json({ success: true, counted: false })
}
