export type Tab = { label: string; href: string; highlight?: boolean }

export const tabs: Tab[] = [
  { label: 'Tümü', href: '/' },
  { label: 'Günlük', href: '/kategori/gunluk' },
  { label: 'Podcast', href: '/ses', highlight: true },
  { label: 'Mikro', href: '/mikro' },
  { label: 'Şu An', href: '/now' },
]
