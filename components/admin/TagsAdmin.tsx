'use client'

import { useState, useMemo } from 'react'
import type { TagRow } from '@/app/admin/etiketler/page'

export default function TagsAdmin({ tags }: { tags: TagRow[] }) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr')
    if (!q) return tags
    return tags.filter(t => t.tag.toLocaleLowerCase('tr').includes(q) || t.slug.includes(q))
  }, [tags, query])

  // Google mantığıyla aynı: 2'den az YAYINLANMIŞ yazısı olan etiket indekslenmez
  const notIndexed = tags.filter(t => t.published < 2).length

  async function copyTag(tag: string) {
    try {
      await navigator.clipboard.writeText(tag)
      setCopied(tag)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      /* clipboard yoksa sessizce geç */
    }
  }

  return (
    <div style={{ padding: 'clamp(20px, 5vw, 36px) clamp(16px, 5vw, 40px)', maxWidth: '760px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Etiketler
        </h1>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          {tags.length} etiket · {notIndexed} tanesi Google'da görünmüyor
        </p>
      </div>

      {/* Bilgi notu */}
      <div style={{
        backgroundColor: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: '10px',
        padding: '12px 16px', marginBottom: '20px',
        fontSize: '12.5px', lineHeight: '19px', color: '#6b7280',
      }}>
        Yeni yazı yayınlamadan önce buraya bakıp mevcut bir etiketi tekrar kullan — böylece
        «wwdc» ve «WWDC» gibi ikizler oluşmaz. Etikete tıklayınca metni kopyalanır. Sayı = etiketin
        geçtiği toplam yazı.
        <span style={{ color: '#f59e0b', fontWeight: 600 }}> Sarı</span> = 2'den az yayınlanmış yazı,
        yani Google indekslemiyor; istersen silebilirsin, SEO'ya zarar vermez. Renk kaybolunca
        (2+ yayın) artık indeksleniyor demektir, silme.
      </div>

      {/* Arama */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Etiket ara…"
        style={{
          width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
          borderRadius: '10px', fontSize: '15px', outline: 'none',
          boxSizing: 'border-box', marginBottom: '20px',
        }}
      />

      {/* Liste */}
      {filtered.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>
          {tags.length === 0 ? 'Henüz hiç etiket yok.' : 'Eşleşen etiket bulunamadı.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {filtered.map(t => {
            const isSingle = t.published < 2
            return (
              <div
                key={t.slug}
                onClick={() => copyTag(t.tag)}
                title="Kopyala"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '7px 12px', borderRadius: '999px',
                  border: `1px solid ${isSingle ? '#fde68a' : '#e5e7eb'}`,
                  backgroundColor: isSingle ? '#fffbeb' : '#ffffff',
                  cursor: 'pointer', userSelect: 'none',
                  transition: 'border-color 0.12s',
                }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#374151' }}>
                  {copied === t.tag ? '✓ kopyalandı' : `#${t.tag}`}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: isSingle ? '#b45309' : '#9ca3af',
                  backgroundColor: isSingle ? '#fef3c7' : '#f3f4f6',
                  borderRadius: '999px', padding: '1px 7px', minWidth: '18px', textAlign: 'center',
                }}>
                  {t.total}
                </span>
                <a
                  href={`/etiket/${t.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  title="Arşiv sayfasını aç"
                  style={{ display: 'flex', alignItems: 'center', color: '#c3c6d6', textDecoration: 'none' }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
