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
    <header style={{ backgroundColor: '#f5f5f5' }}>
      <div className="max-w-[900px] mx-auto px-5 py-6 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight hover:opacity-60 transition-opacity" style={{ color: '#111827', fontSize: '17px' }}>
          tr.dincer
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium transition-colors hover:opacity-60"
              style={{ color: '#111827', fontSize: '15px' }}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/arama" aria-label="Ara" className="transition-opacity hover:opacity-60" style={{ color: '#111827' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}
