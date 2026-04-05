import { createAdminClient } from '@/lib/supabase-admin'
import AdminShell from '@/components/admin/AdminShell'
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

  return (
    <AdminShell currentPath={`/admin/posts/${params.id}/edit`}>
      <PostEditor post={post} categories={categories || []} />
    </AdminShell>
  )
}
