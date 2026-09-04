import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

type RelatedPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string
  categories: string[] | null
  reading_time: string | null
}

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="px-5 sm:px-16 pb-16 sm:pb-24 pt-4">
      <h2 style={{
        fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 20px',
      }}>
        İlgili Yazılar
      </h2>

      <div className="related-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}>
        {posts.map(post => (
          <Link
            key={post.id}
            href={`/${post.slug}`}
            className="related-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '22px 24px',
              backgroundColor: '#ffffff',
              border: '1px solid #eceef1',
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
            }}
          >
            {/* Meta */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px',
              marginBottom: '10px',
            }}>
              {post.categories?.[0] && (
                <span style={{
                  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.07em', color: '#adb5bd',
                }}>
                  {post.categories[0]}
                </span>
              )}
              {post.reading_time && (
                <>
                  <span style={{ color: '#d1d5db', fontSize: '11px' }}>•</span>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: '#adb5bd',
                  }}>
                    {post.reading_time}
                  </span>
                </>
              )}
            </div>

            {/* Başlık */}
            <h3 className="related-title" style={{
              fontSize: '19px', lineHeight: '26px', fontWeight: 700,
              color: '#111827', letterSpacing: '-0.01em', margin: '0 0 8px',
              transition: 'color 0.15s',
            }}>
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="related-excerpt" style={{
                fontSize: '14px', lineHeight: '22px', color: '#6b7280',
                margin: '0 0 14px',
              }}>
                {post.excerpt}
              </p>
            )}

            {/* Tarih */}
            <span style={{
              fontSize: '12px', color: '#adb5bd', marginTop: 'auto',
            }}>
              {format(new Date(post.published_at), 'd MMMM yyyy', { locale: tr })}
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        .related-card:hover {
          border-color: #dfe2e6;
          box-shadow: 0 6px 20px rgba(17,24,39,0.06);
          transform: translateY(-2px);
        }
        .related-card:hover .related-title { color: #d00202; }
        .related-excerpt {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
