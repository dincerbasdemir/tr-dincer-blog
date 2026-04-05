import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, categories, reading_time, featured_image')
    .order('published_at', { ascending: false })
    .limit(21)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  return data
}

// Başlığa göre deterministik soft renk
const PLACEHOLDER_COLORS = [
  '#f1ede8', '#e8edf1', '#ece8f1', '#e8f1ee', '#f1ebe8',
  '#edf1e8', '#f1e8ec', '#e8f0f1', '#f1f0e8',
]
function placeholderColor(title: string) {
  return PLACEHOLDER_COLORS[title.charCodeAt(0) % PLACEHOLDER_COLORS.length]
}

export default async function Home() {
  const posts = await getPosts()
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ── Featured ── */}
      {featured && (
        <Link href={`/${featured.slug}`} className="group block mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-7 md:p-9">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Son Yazı
            </span>
            <h2 className="font-serif text-3xl md:text-[2.6rem] font-semibold leading-tight text-gray-900 group-hover:text-gray-600 transition-colors mb-3 text-balance">
              {featured.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <time dateTime={featured.published_at}>
                {format(new Date(featured.published_at), 'd MMMM yyyy', { locale: tr })}
              </time>
              {featured.reading_time && <><span>·</span><span>{featured.reading_time}</span></>}
              {featured.categories?.[0] && <><span>·</span><span>{featured.categories[0]}</span></>}
            </div>
            {featured.excerpt && (
              <p className="text-gray-500 text-base leading-relaxed line-clamp-3 max-w-3xl">
                {featured.excerpt}
              </p>
            )}
          </div>
        </Link>
      )}

      {/* ── Card Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rest.map((post) => (
          <article key={post.id}>
            <Link href={`/${post.slug}`} className="group flex gap-4 items-stretch bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4">

              {/* Thumbnail */}
              {post.featured_image ? (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-[88px] h-[68px] object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div
                  className="w-[88px] h-[68px] rounded-lg flex-shrink-0"
                  style={{ backgroundColor: placeholderColor(post.title) }}
                />
              )}

              {/* Text */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <h3 className="font-serif text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), 'd MMM yyyy', { locale: tr })}
                  </time>
                  {post.reading_time && <><span>·</span><span>{post.reading_time}</span></>}
                  {post.categories?.[0] && <><span>·</span><span>{post.categories[0]}</span></>}
                </div>
              </div>

            </Link>
          </article>
        ))}
      </div>

    </div>
  )
}

export const revalidate = 3600
