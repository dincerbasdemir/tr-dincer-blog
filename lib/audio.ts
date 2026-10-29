// Supabase Storage'daki ses dosyasının herkese açık URL'i.
// Depolama katmanı ilerde R2'ye taşınırsa sadece bu fonksiyon değişecek.
export function audioPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/audio/${path}`
}

// Saniyeyi mm:ss formatına çevirir
export function formatDuration(seconds?: number | null): string {
  if (!seconds || !isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
