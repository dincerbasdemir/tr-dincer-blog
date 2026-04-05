import { NextRequest, NextResponse } from 'next/server'

async function hashToken(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth endpoints are always open
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/login/' ||
    pathname.startsWith('/api/admin/auth')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin_auth')?.value

  if (!token) {
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    const expected = await hashToken(
      (process.env.ADMIN_PASSWORD || '') + ':' + (process.env.ADMIN_SECRET || 'secret')
    )

    if (token !== expected) {
      if (pathname.startsWith('/api/admin/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  } catch {
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
