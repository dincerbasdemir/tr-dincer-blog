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

function Thumbnail({ src, title }: { src?: string; title: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={title}
        className="w-24 h-16 object-cover rounded flex-shrink-0 bg-gray-100"
      />
    )
  }
  // Placeholder: kategori/başlık bazlı subtle renk
  const colors = [
    'bg-stone-100', 'bg-slate-100', 'bg-zinc-100',
    'bg-neutral-100', 'bg-gray-100',
  ]
  const color = colors[title.charCodeAt(0) % colors.length]
  return (
    <div className={`w-24 h-16 rounded flex-shrink-0 ${color}`} />
  )
}

export default async function Home() {
  const posts = await getPosts()
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Featured Post */}
      {featured && (
        <div className="mb-10 pb-10 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Son Yazı
          </p>
          <Link href={`/${featured.slug}`} className="group">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-gray-500 transition-colors leading-tight mb-3">
              {featured.title}
            </h2>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <time dateTime={featured.published_at}>
              {format(new Date(featured.published_at), 'd MMMM yyyy', { locale: tr })}
            </time>
            {featured.reading_time && (
              <><span>·</span><span>{featured.reading_time}</span></>
            )}
            {featured.categories?.[0] && (
              <><span>·</span><span>{featured.categories[0]}</span></>
            )}
          </div>
          {featured.excerpt && (
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
              {featured.excerpt}
            </p>
          )}
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        {rest.map((post) => (
          <article key={post.id}>
            <Link href={`/${post.slug}`} className="group flex gap-4 items-start">
              <Thumbnail src={post.featured_image} title={post.title} />
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-gray-500 transition-colors leading-snug mb-1.5 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), 'd MMM yyyy', { locale: tr })}
                  </time>
                  {post.reading_time && (
                    <><span>·</span><span>{post.reading_time}</span></>
                  )}
                  {post.categories?.[0] && (
                    <><span>·</span><span>{post.categories[0]}</span></>
                  )}
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
