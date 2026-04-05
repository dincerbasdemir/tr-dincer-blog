import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

async function loginAction(formData: FormData) {
  'use server'
  const password = formData.get('password') as string

  if (password && password === process.env.ADMIN_PASSWORD) {
    const token = crypto
      .createHash('sha256')
      .update((process.env.ADMIN_PASSWORD || '') + ':' + (process.env.ADMIN_SECRET || 'secret'))
      .digest('hex')

    cookies().set('admin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    redirect('/admin')
  }

  redirect('/admin/login?error=1')
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const hasError = !!searchParams?.error

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          padding: '52px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
            tr.dincer
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#9ca3af',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Admin Panel
          </div>
        </div>

        <form action={loginAction}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
              }}
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '15px',
                border: `1px solid ${hasError ? '#fca5a5' : '#e5e7eb'}`,
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {hasError && (
            <div
              style={{
                fontSize: '13px',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '10px 12px',
                marginBottom: '16px',
              }}
            >
              Hatalı şifre. Tekrar deneyin.
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  )
}
