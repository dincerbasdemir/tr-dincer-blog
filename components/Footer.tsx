export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer style={{ borderTop: '1px solid #f3f4f6', marginTop: '4rem' }}>
      <div className="max-w-[740px] mx-auto px-5 py-10 flex flex-col md:flex-row justify-between gap-6">
        {/* Sol */}
        <div>
          <div className="font-bold text-sm text-gray-900 mb-1">tr.dincer</div>
          <p style={{ fontSize: '13px', color: '#9ca3af', maxWidth: '260px', lineHeight: '20px' }}>
            Ağacı sev, yeşili koru, ayıyı öp.
          </p>
        </div>
        {/* Sağ: linkler */}
        <div className="flex flex-col gap-2 text-sm" style={{ color: '#6b7280' }}>
          <a href="/rss.xml" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            RSS <span style={{ fontSize: '10px' }}>↗</span>
          </a>
          <a href="https://th.dincer.co" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            Mikro Blog <span style={{ fontSize: '10px' }}>↗</span>
          </a>
          <a href="/ben" className="hover:text-gray-900 transition-colors">
            Hakkımda
          </a>
        </div>
      </div>
      <div className="max-w-[740px] mx-auto px-5 pb-8 flex justify-between items-center" style={{ fontSize: '12px', color: '#d1d5db' }}>
        <span>© {currentYear} tr.dincer</span>
        <span>114 yazı</span>
      </div>
    </footer>
  )
}
