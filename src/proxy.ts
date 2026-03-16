import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path starts with /lms-admin
  if (path.startsWith('/lms-admin')) {
    // Exclude /lms-admin/login from protection
    if (path === '/lms-admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      console.warn(`Admin access denied to path ${path}: No token found.`)
      return NextResponse.redirect(new URL('/lms-admin/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, secret)
      
      if (payload.role !== 'superadmin') {
        console.warn(`Admin access denied to path ${path}: Not a superadmin.`)
        return NextResponse.redirect(new URL('/lms-admin/login', request.url))
      }

      // Valid admin token
      const response = NextResponse.next()
      response.headers.set('X-Admin-Email', payload.email as string)
      return response

    } catch (error) {
      console.warn(`Admin access denied to path ${path}: Invalid or expired token.`)
      return NextResponse.redirect(new URL('/lms-admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/lms-admin/:path*'],
}
