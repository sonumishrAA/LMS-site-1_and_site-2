import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const response = NextResponse.redirect(new URL('/lms-admin/login', url.origin))
  
  response.cookies.set({
    name: 'admin_token',
    value: '',
    maxAge: 0,
    path: '/',
  })

  return response
}
