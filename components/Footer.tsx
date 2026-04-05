export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {currentYear} tr.dincer
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a 
              href="/rss.xml" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              RSS
            </a>
            <a 
              href="https://th.dincer.co" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Mikro Blog
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Burada <span className="font-medium" id="word-count">21,293</span> kelimeden oluşan{' '}
          <span className="font-medium" id="post-count">114</span> yazı bulunuyor.
        </div>
      </div>
    </footer>
  )
}
