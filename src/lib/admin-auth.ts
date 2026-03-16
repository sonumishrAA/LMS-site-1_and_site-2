// src/lib/admin-auth.ts
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: 'superadmin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  if (payload.role !== 'superadmin') throw new Error('Not superadmin')
  return payload
}

// Use in API routes:
export async function getAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) throw new Error('No token')
  return verifyAdminToken(token)
}

// Use in Server Components:
export async function getAdminFromCookies() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  try {
    return await verifyAdminToken(token)
  } catch {
    return null
  }
}
