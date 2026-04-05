import Link from 'next/link'

const navLinks = [
  { name: 'Ben', href: '/ben' },
  { name: 'Günlük', href: '/kategori/gunluk' },
  { name: 'Pazarlama', href: '/kategori/dijital-pazarlama' },
  { name: 'Tasarım', href: '/kategori/tasarim' },
  { name: 'Teknoloji', href: '/kategori/teknoloji' },
]

export default function Header() {
  return (
    <header className="w-full">
      <div className="max-w-[740px] mx-auto px-5 py-6 flex items-center justify-between">
        <Link href="/" className="text-base font-bold tracking-tight text-gray-900 hover:opacity-70 transition-opacity">
          tr.dincer
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/arama" aria-label="Ara" className="text-gray-400 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}
