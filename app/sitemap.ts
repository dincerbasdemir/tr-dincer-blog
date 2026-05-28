import { supabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tr.dincer.co'

  // Sadece yayınlanmış yazıları al
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Supabase'deki sayfaları al
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, updated_at')

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Yazı sayfaları
  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Supabase sayfaları
  const pageEntries: MetadataRoute.Sitemap = (pages || []).map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...pageEntries]
}
