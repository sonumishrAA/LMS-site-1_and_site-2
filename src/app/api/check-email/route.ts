import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const { data: staff } = await supabaseService
      .from('staff')
      .select('name, role')
      .eq('email', email)
      .eq('role', 'owner')
      .single()

    if (staff) {
      return NextResponse.json({ exists: true, owner_name: staff.name })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error('check-email error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
