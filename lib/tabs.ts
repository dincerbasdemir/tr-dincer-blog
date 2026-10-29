export type Tab = { label: string; href: string; highlight?: boolean }

export const tabs: Tab[] = [
  { label: 'Tümü', href: '/' },
  { label: 'Günlük', href: '/kategori/gunluk' },
  { label: 'Podcast', href: '/ses', highlight: true },
  { label: 'Pazarlama', href: '/kategori/dijital-pazarlama' },
  { label: 'Tasarım', href: '/kategori/tasarim' },
  { label: 'Teknoloji', href: '/kategori/teknoloji' },
  { label: 'Yapay Zeka', href: '/kategori/yapay-zeka' },
  { label: 'Mikro', href: '/mikro' },
  { label: 'Şu An', href: '/now' },
]
