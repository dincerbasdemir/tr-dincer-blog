export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer style={{ backgroundColor: '#f5f5f5', borderTop: '1px solid #e5e7eb', marginTop: '2rem' }}>
      <div className="max-w-[900px] mx-auto px-5 py-12 flex flex-col md:flex-row justify-between gap-8">
        {/* Sol */}
        <div style={{ maxWidth: '260px' }}>
          <div className="font-bold text-sm mb-2" style={{ color: '#111827' }}>tr.dincer</div>
          <p style={{ fontSize: '13px', lineHeight: '20px', color: '#9ca3af' }}>
            <a href="https://www.instagram.com/p/CR_b_QtDOMX/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Ağacı sev, yeşili koru, ayıyı öp.</a> Bu kişisel bir blogtur.
          </p>
        </div>

        {/* Sağ: Linkler */}
        <div className="flex gap-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>Kategoriler</div>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Günlük', href: '/kategori/gunluk' },
                { name: 'Pazarlama', href: '/kategori/dijital-pazarlama' },
                { name: 'Tasarım', href: '/kategori/tasarim' },
                { name: 'Teknoloji', href: '/kategori/teknoloji' },
              ].map((l) => (
                <a key={l.href} href={l.href} className="text-sm hover:text-gray-900 transition-colors" style={{ color: '#6b7280' }}>{l.name}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>Sayfalar</div>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Ben', href: '/ben' },
                { name: 'Şu An', href: '/now' },
                { name: 'Arama', href: '/arama' },
                { name: 'RSS', href: '/rss.xml' },
                { name: 'Mikro Blog', href: '/mikro' },
              ].map((l) => (
                <a key={l.href} href={l.href} className="text-sm hover:text-gray-900 transition-colors" style={{ color: '#6b7280' }}>{l.name}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-5 pb-8" style={{ fontSize: '12px', color: '#d1d5db' }}>
        © {currentYear} tr.dincer · Tüm hakları saklıdır.
      </div>
    </footer>
  )
}
