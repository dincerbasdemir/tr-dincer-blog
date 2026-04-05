'use client'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ padding: '40px', fontFamily: 'monospace' }}>
        <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Global Hata</h2>
        <p><strong>Mesaj:</strong> {error.message}</p>
        <p><strong>Digest:</strong> {error.digest}</p>
        <pre style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', fontSize: '12px', overflow: 'auto' }}>
          {error.stack}
        </pre>
      </body>
    </html>
  )
}
