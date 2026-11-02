import { createAdminClient } from '@/lib/supabase-admin'
import { slugify } from '@/lib/slug'
import { NextRequest, NextResponse } from 'next/server'

// Marka önekli, benzersiz bölüm slug'ı üret
async function makeUniqueSlug(supabase: any, title: string): Promise<string> {
  const base = 'yalniz-isler-ofisi-' + (slugify(title) || 'bolum')
  let slug = base
  let n = 2
  for (let i = 0; i < 50; i++) {
    const { data } = await supabase.from('audio_episodes').select('id').eq('slug', slug).maybeSingle()
    if (!data) return slug
    slug = `${base}-${n++}`
  }
  return `${base}-${Date.now()}`
}

// POST /api/admin/audio — yükleme sonrası bölüm kaydını oluştur
export async function POST(req: NextRequest) {
  try {
    const { title, description, audio_path, duration, file_size, post_slug, published } = await req.json()

    if (!title?.trim() || !audio_path) {
      return NextResponse.json({ error: 'Başlık ve ses dosyası gerekli.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const slug = await makeUniqueSlug(supabase, title)

    const { data, error } = await supabase
      .from('audio_episodes')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        audio_path,
        duration: duration ?? null,
        file_size: file_size ?? null,
        post_slug: post_slug?.trim() || null,
        published: published ?? true,
        slug,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ episode: data })
  } catch (err: any) {
    console.error('audio insert error:', err)
    return NextResponse.json({ error: 'Bölüm kaydedilemedi.' }, { status: 500 })
  }
}
