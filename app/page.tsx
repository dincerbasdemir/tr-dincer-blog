import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import PostGrid from '@/components/PostGrid'

// featured(1) + ilk grid(10) = 11
const INITIAL_FETCH = 11

const PLACEHOLDER_COLORS = [
  '#f0ece6', '#e6edf0', '#ebe6f0', '#e6f0ec',
  '#f0e9e6', '#ecf0e6', '#f0e6ea', '#e6eff0',
]
function placeholderColor(title: string) {
  return PLACEHOLDER_COLORS[title.charCodeAt(0) % PLACEHOLDER_COLORS.length]
}

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, categories, reading_time, featured_image')
    .order('published_at', { ascending: false })
    .limit(INITIAL_FETCH)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  return data
}

export default async function Home() {
  const posts = await getPosts()
  const featured = posts[0]
  const gridPosts = posts.slice(1) // ilk 10 kart

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ── Featured ── */}
      {featured && (
        <Link href={`/${featured.slug}`} className="group block mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-7 md:p-9">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Son Yazı
            </span>

            {featured.featured_image ? (
              <img
                src={featured.featured_image}
                alt={featured.title}
                className="w-full h-52 object-cover rounded-xl mb-5"
              />
            ) : (
              <div
                className="w-full h-52 rounded-xl mb-5"
                style={{ backgroundColor: placeholderColor(featured.title) }}
              />
            )}

            <h2
              className="font-semibold text-gray-900 group-hover:text-gray-500 transition-colors mb-3 text-balance"
              style={{ fontSize: '32px', lineHeight: '40px' }}
            >
              {featured.title}
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <time dateTime={featured.published_at}>
                {format(new Date(featured.published_at), 'd MMMM yyyy', { locale: tr })}
              </time>
              {featured.reading_time && <><span>·</span><span>{featured.reading_time}</span></>}
              {featured.categories?.[0] && <><span>·</span><span>{featured.categories[0]}</span></>}
            </div>

            {featured.excerpt && (
              <p className="text-gray-500 text-base leading-relaxed line-clamp-2 max-w-3xl">
                {featured.excerpt}
              </p>
            )}
          </div>
        </Link>
      )}

      {/* ── Grid + Infinite Scroll ── */}
      <PostGrid initialPosts={gridPosts} initialOffset={INITIAL_FETCH} />

    </div>
  )
}

export const revalidate = 3600
