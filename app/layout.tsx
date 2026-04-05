import './globals.css'
import type { Metadata } from 'next'
import { DM_Sans, Lora } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'tr.dincer - Ağacı sev, yeşili koru, ayıyı öp.',
  description: 'Kişisel blog - Teknoloji, tasarım, pazarlama ve günlük düşünceler',
  keywords: ['blog', 'teknoloji', 'tasarım', 'pazarlama', 'günlük'],
  authors: [{ name: 'Dinçer' }],
  metadataBase: new URL('https://tr.dincer.co'),
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
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${dmSans.variable} ${lora.variable}`}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
