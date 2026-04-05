import { supabase } from '@/lib/supabase'

export default async function sitemap() {
  const baseUrl = 'https://tr.dincer.co'

  // Tüm yazıları al
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .order('published_at', { ascending: false })

  // Kategoriler
  const categories = [
    'gunluk',
    'dijital-pazarlama',
    'genel-kultur',
    'tasarim',
    'teknoloji',
    'yapay-zeka',
    'podcast',
    'bilim',
    'alintilar',
  ]

  // Statik sayfalar
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ben`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Yazı sayfaları
  const postPages = (posts || []).map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Kategori sayfaları
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/kategori/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...categoryPages]
}
