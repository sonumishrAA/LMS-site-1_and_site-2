import { NextRequest, NextResponse } from 'next/server'
import { verifyCrossSiteToken } from '@/lib/jwt'
import { supabaseService } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')
    const purpose = request.nextUrl.searchParams.get('purpose')

    if (!token) return NextResponse.json({ error: 'Token missing' }, { status: 400 })

    const payload = verifyCrossSiteToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

    if (purpose && payload.purpose !== purpose) {
      return NextResponse.json({ error: 'Invalid token purpose' }, { status: 403 })
    }

    // For renewal, fetch library details
    if (payload.purpose === 'renew' && payload.library_id) {
      const { data: library } = await supabaseService
        .from('libraries')
        .select('name, subscription_status, subscription_end')
        .eq('id', payload.library_id)
        .single()

      if (!library) {
        return NextResponse.json({ error: 'Library not found' }, { status: 404 })
      }

      return NextResponse.json({
        valid: true,
        payload,
        library
      })
    }

    // For add-library, just return payload
    return NextResponse.json({
      valid: true,
      payload
    })
  } catch (error) {
    console.error('verify-token error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
