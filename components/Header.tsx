import Link from 'next/link'

const categories = [
  { name: 'Günlük', slug: 'gunluk' },
  { name: 'Pazarlama', slug: 'dijital-pazarlama' },
  { name: 'Genel Kültür', slug: 'genel-kultur' },
  { name: 'Tasarım', slug: 'tasarim' },
  { name: 'Teknoloji', slug: 'teknoloji' },
]

export default function Header() {
  return (
    <header className="border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-xl font-bold text-gray-900 tracking-tight hover:text-gray-500 transition-colors">
            tr.dincer
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-5 text-sm text-gray-500 flex-wrap justify-end">
          <Link href="/ben" className="hover:text-gray-900 transition-colors font-medium">
            Ben
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="hover:text-gray-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/arama" className="hover:text-gray-900 transition-colors" aria-label="Ara">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}
