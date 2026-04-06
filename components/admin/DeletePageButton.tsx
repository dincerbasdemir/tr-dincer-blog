'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeletePageButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`"${title}" sayfasını silmek istediğinden emin misin?`)) return
    setLoading(true)
    await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        fontSize: '12px',
        fontWeight: 600,
        color: '#dc2626',
        padding: '5px 12px',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        background: 'white',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        opacity: loading ? 0.5 : 1,
      }}
    >
      {loading ? '…' : 'Sil'}
    </button>
  )
}
