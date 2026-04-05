import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function computeToken() {
  return crypto
    .createHash('sha256')
    .update((process.env.ADMIN_PASSWORD || '') + ':' + (process.env.ADMIN_SECRET || 'secret'))
    .digest('hex')
}

// POST /api/admin/auth — login
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 })
  }

  const token = computeToken()
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_auth', '', { maxAge: 0, path: '/' })
  return response
}
