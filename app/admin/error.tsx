'use client'

export default function AdminError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Admin Hata</h2>
      <p style={{ marginBottom: '8px' }}><strong>Mesaj:</strong> {error.message}</p>
      <p style={{ marginBottom: '16px' }}><strong>Digest:</strong> {error.digest}</p>
      <pre style={{
        backgroundColor: '#f3f4f6',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '12px',
        overflow: 'auto',
        maxHeight: '400px',
      }}>
        {error.stack}
      </pre>
    </div>
  )
}
