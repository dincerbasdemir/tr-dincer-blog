import { createAdminClient } from '@/lib/supabase-admin'
import { slugify } from '@/lib/slug'
import AdminShell from '@/components/admin/AdminShell'
import TagsAdmin from '@/components/admin/TagsAdmin'

export const dynamic = 'force-dynamic'

export type TagRow = {
  tag: string
  slug: string
  total: number
  published: number
}

export default async function AdminEtiketlerPage() {
  const supabase = createAdminClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('tags, status')

  // Etiketleri topla (küçük harf slug'a göre grupla, ilk görülen yazımı sakla)
  const map = new Map<string, TagRow>()
  for (const post of posts || []) {
    const isPublished = post.status === 'published'
    for (const rawTag of post.tags || []) {
      const tag = (rawTag as string).trim()
      if (!tag) continue
      const slug = slugify(tag)
      if (!slug) continue
      const existing = map.get(slug)
      if (existing) {
        existing.total += 1
        if (isPublished) existing.published += 1
      } else {
        map.set(slug, { tag, slug, total: 1, published: isPublished ? 1 : 0 })
      }
    }
  }

  const tags = Array.from(map.values()).sort(
    (a, b) => b.total - a.total || a.tag.localeCompare(b.tag, 'tr')
  )

  return (
    <AdminShell currentPath="/admin/etiketler">
      <TagsAdmin tags={tags} />
    </AdminShell>
  )
}
