export type Tab = { label: string; href: string; highlight?: boolean }

export const tabs: Tab[] = [
  { label: 'Yazılar', href: '/' },
  { label: 'Podcast', href: '/ses', highlight: true },
  { label: 'Mikro', href: '/mikro' },
  { label: 'Şu An', href: '/now' },
]
