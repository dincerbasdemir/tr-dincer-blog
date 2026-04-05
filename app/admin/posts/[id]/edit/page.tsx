import { createAdminClient } from '@/lib/supabase-admin'
import PostEditor from '@/components/admin/PostEditor'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!post) notFound()

  return <PostEditor post={post} categories={categories || []} />
}
