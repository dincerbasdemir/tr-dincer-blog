import Link from 'next/link'
import Search from './Search'

export default function Header() {
  const categories = [
    { name: 'Günlük', slug: 'gunluk' },
    { name: 'Pazarlama', slug: 'dijital-pazarlama' },
    { name: 'Genel Kültür', slug: 'genel-kultur' },
    { name: 'Tasarım', slug: 'tasarim' },
    { name: 'Teknoloji', slug: 'teknoloji' },
  ]

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Logo / Site Title */}
        <div className="mb-6">
          <Link href="/" className="group">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2 group-hover:text-gray-600 transition-colors">
              tr.dincer
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-light italic">
              Ağacı sev, yeşili koru, ayıyı öp.
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link 
            href="/ben" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Ben
          </Link>
          
          <span className="text-gray-300">•</span>
          
          {categories.map((cat, index) => (
            <div key={cat.slug} className="flex items-center gap-4">
              <Link
                href={`/kategori/${cat.slug}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {cat.name}
              </Link>
              {index < categories.length - 1 && (
                <span className="text-gray-300">•</span>
              )}
            </div>
          ))}
        </nav>

        {/* Search */}
        <div className="mt-6">
          <Search />
        </div>
      </div>
    </header>
  )
}
