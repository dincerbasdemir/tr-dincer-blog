import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-16">
        {posts.map((post) => (
          <article key={post.id} className="fade-in">
            <Link href={`/${post.slug}`} className="group">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors text-balance">
                {post.title}
              </h2>
            </Link>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
              </time>
              {post.reading_time && (
                <>
                  <span>•</span>
                  <span>{post.reading_time}</span>
                </>
              )}
              {post.categories && post.categories.length > 0 && (
                <>
                  <span>•</span>
                  <span>{post.categories[0]}</span>
                </>
              )}
            </div>

            {post.excerpt && (
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {post.excerpt}
              </p>
            )}

            <Link
              href={`/${post.slug}`}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Devamını oku
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </article>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-16 flex justify-center gap-2">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Önceki
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md">
          1
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          2
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Sonraki
        </button>
      </div>
    </div>
  )
}

export const revalidate = 3600 // Revalidate every hour
