import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    // 1. Fetch user by email
    const { data: authUsers, error: listError } = await supabaseService.auth.admin.listUsers()
    if (listError) throw listError

    const user = authUsers.users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json({ verified: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // Since we don't have access to Supabase stored raw passwords to compare, 
    // and Site 1 login isn't a true login but a verification step, 
    // we must perform a secure login attempt using the client SDK.
    const { data: signInData, error: signInError } = await supabaseService.auth.signInWithPassword({
      email,
      password
    })

    if (signInError || !signInData.user) {
      return NextResponse.json({ verified: false, error: 'Invalid password' }, { status: 401 })
    }

    // Clean up the session immediately since we just needed verification
    await supabaseService.auth.signOut()

    // 2. Fetch their existing libraries to show in UI
    const { data: staff } = await supabaseService
      .from('staff')
      .select('id, name, library_ids')
      .eq('user_id', signInData.user.id)
      .single()

    let libraries: any[] = []
    if (staff?.library_ids?.length) {
      const { data: libs } = await supabaseService
        .from('libraries')
        .select('name, city')
        .in('id', staff.library_ids)
      
      libraries = libs || []
    }

    return NextResponse.json({ 
      verified: true, 
      owner_id: signInData.user.id,
      owner_name: staff?.name,
      libraries 
    })
  } catch (error) {
    console.error('verify-owner-password error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
