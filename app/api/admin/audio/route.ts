import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/audio — yükleme sonrası bölüm kaydını oluştur
export async function POST(req: NextRequest) {
  try {
    const { title, description, audio_path, duration, file_size, post_slug, published } = await req.json()

    if (!title?.trim() || !audio_path) {
      return NextResponse.json({ error: 'Başlık ve ses dosyası gerekli.' }, { status: 400 })
    }

    const supabase = createAdminClient()
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
