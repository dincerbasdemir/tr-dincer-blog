import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const inputBuffer = Buffer.from(bytes)

  const mime = file.type.toLowerCase()
  let outputBuffer: Buffer
  let contentType: string
  let ext: string

  if (mime === 'image/png') {
    // PNG → kayıpsız WebP
    outputBuffer = await sharp(inputBuffer)
      .webp({ lossless: true, effort: 6 })
      .toBuffer()
    contentType = 'image/webp'
    ext = 'webp'
  } else if (mime === 'image/gif') {
    // GIF → olduğu gibi bırak (animasyon kaybı olmasın)
    outputBuffer = inputBuffer
    contentType = 'image/gif'
    ext = 'gif'
  } else {
    // JPEG, WebP, AVIF vs. → yüksek kalite WebP (görsel kayıp minimumdur)
    outputBuffer = await sharp(inputBuffer)
      .webp({ quality: 90, effort: 6 })
      .toBuffer()
    contentType = 'image/webp'
    ext = 'webp'
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const supabase = createAdminClient()

  const { error } = await supabase.storage
    .from('post-images')
    .upload(filename, outputBuffer, {
      contentType,
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(filename)

  return NextResponse.json({ url: publicUrl })
}
