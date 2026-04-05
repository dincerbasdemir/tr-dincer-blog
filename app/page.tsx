import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import PostGrid from '@/components/PostGrid'

const INITIAL_FETCH = 11 // 1 featured + 10 grid

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

  if (error) return []
  return data
}

export default async function Home() {
  const posts = await getPosts()
  const featured = posts[0]
  const gridPosts = posts.slice(1)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" style={{ backgroundColor: '#fbf9f8' }}>

      {/* ── Featured ── */}
      {featured && (
        <Link href={`/${featured.slug}`} className="group block mb-6">
          <div
            className="bg-white transition-all duration-200 p-6 md:p-8"
            style={{ borderRadius: '2px' }}
          >
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-5">
              Son Yazı
            </span>

            <div className="flex gap-6 items-start">
              {featured.featured_image ? (
                <img
                  src={featured.featured_image}
                  alt={featured.title}
                  className="flex-shrink-0 object-cover"
                  style={{ width: '220px', height: '160px', borderRadius: '3px' }}
                />
              ) : (
                <div
                  className="flex-shrink-0"
                  style={{
                    width: '220px',
                    height: '160px',
                    borderRadius: '3px',
                    backgroundColor: placeholderColor(featured.title),
                  }}
                />
              )}

              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <h2
                  className="text-gray-900 group-hover:text-gray-500 transition-colors text-balance"
                  style={{ fontSize: '28px', lineHeight: '36px', fontWeight: 800 }}
                >
                  {featured.title}
                </h2>

                {featured.excerpt && (
                  <p
                    className="text-gray-500"
                    style={{
                      fontSize: '15px',
                      lineHeight: '22px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {featured.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: '12px' }}>
                  <time dateTime={featured.published_at}>
                    {format(new Date(featured.published_at), 'd MMMM yyyy', { locale: tr })}
                  </time>
                  {featured.reading_time && <><span>·</span><span>{featured.reading_time}</span></>}
                  {featured.categories?.[0] && <><span>·</span><span>{featured.categories[0]}</span></>}
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Grid + Infinite Scroll ── */}
      <PostGrid initialPosts={gridPosts} initialOffset={INITIAL_FETCH} />

    </div>
  )
}

export const revalidate = 3600
