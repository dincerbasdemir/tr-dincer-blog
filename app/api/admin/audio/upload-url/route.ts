import { createAdminClient } from '@/lib/supabase-admin'
import { slugify } from '@/lib/slug'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/audio/upload-url
// İmzalı yükleme URL'i üretir — dosya doğrudan Supabase'e gider (Vercel 4.5MB limitini aşmaz)
export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json()
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Dosya adı gerekli.' }, { status: 400 })
    }

    const extMatch = /\.([a-zA-Z0-9]+)$/.exec(filename)
    const ext = (extMatch ? extMatch[1] : 'mp3').toLowerCase()
    const base = slugify(filename.replace(/\.[a-zA-Z0-9]+$/, '')) || 'bolum'
    const path = `${Date.now()}-${base}.${ext}`

    const supabase = createAdminClient()
    const { data, error } = await supabase.storage.from('audio').createSignedUploadUrl(path)
    if (error) throw error

    return NextResponse.json({ path: data.path, token: data.token })
  } catch (err: any) {
    console.error('upload-url error:', err)
    return NextResponse.json({ error: 'İmzalı URL oluşturulamadı.' }, { status: 500 })
  }
}
