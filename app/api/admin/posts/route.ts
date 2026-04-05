import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/admin/posts — list all posts
export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, published_at, categories, status')
    .order('published_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/posts — create post
export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: body.title,
      slug: body.slug,
      content: body.content || '',
      excerpt: body.excerpt || null,
      published_at: body.published_at || new Date().toISOString(),
      categories: body.categories || [],
      tags: body.tags || [],
      reading_time: body.reading_time || null,
      featured_image: body.featured_image || null,
      meta_description: body.meta_description || null,
      status: body.status || 'published',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
