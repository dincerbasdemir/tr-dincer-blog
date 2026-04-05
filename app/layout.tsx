import './globals.css'
import type { Metadata } from 'next'
import { Inter, Crimson_Pro } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const crimson = Crimson_Pro({ 
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'tr.dincer - Ağacı sev, yeşili koru, ayıyı öp.',
  description: 'Kişisel blog - Teknoloji, tasarım, pazarlama ve günlük düşünceler',
  keywords: ['blog', 'teknoloji', 'tasarım', 'pazarlama', 'günlük'],
  authors: [{ name: 'Dinçer' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://tr.dincer.co',
    siteName: 'tr.dincer',
    title: 'tr.dincer',
    description: 'Ağacı sev, yeşili koru, ayıyı öp.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tr.dincer',
    description: 'Ağacı sev, yeşili koru, ayıyı öp.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${crimson.variable}`}>
      <body className="bg-white text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
