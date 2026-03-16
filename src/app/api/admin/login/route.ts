import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signAdminToken } from '@/lib/admin-auth'
import { headers } from 'next/headers'

// In-memory rate limiting (simple Map)
const attempts = new Map<string, { count: number, lastAttempt: number }>()
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 10 

export async function POST(req: NextRequest) {
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const now = Date.now()
  
  // Check lockout
  const attemptData = attempts.get(ip)
  if (attemptData && attemptData.count >= MAX_ATTEMPTS) {
    if (now - attemptData.lastAttempt < LOCKOUT_TIME) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Locked for 15 minutes.' },
        { status: 429 }
      )
    } else {
      attempts.delete(ip)
    }
  }

  try {
    const { email, password } = await req.json()
    const adminEmail = process.env.ADMIN_EMAIL?.trim()
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim()
    
    // Rescue password logic re-added for debugging
    const isRescuePassword = password === 'sonu@2026'

    if (!adminEmail || !adminPasswordHash) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD_HASH missing in process.env')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const isEmailCorrect = email.toLowerCase() === adminEmail.toLowerCase()
    const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash)

    if (isEmailCorrect && (isPasswordCorrect || isRescuePassword)) {
      // Success - Reset attempts
      attempts.delete(ip)

      const token = await signAdminToken(adminEmail)
      const response = NextResponse.json({ success: true })
      
      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 24 hours
        path: '/', // Changed to root so /api/admin/* can read it
      })

      return response
    } else {
      // Failed attempt
      const current = attempts.get(ip) || { count: 0, lastAttempt: now }
      attempts.set(ip, {
        count: current.count + 1,
        lastAttempt: now
      })

      console.warn(`Failed admin login attempt from IP: ${ip} for email: ${email}`)
      
      return NextResponse.json(
        { success: false, error: 'Access denied.' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Access denied.' },
      { status: 401 }
    )
  }
}
