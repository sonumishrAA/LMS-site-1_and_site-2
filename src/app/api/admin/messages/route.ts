import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { getAdminFromRequest } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    await getAdminFromRequest(req)
    
    const { data, error } = await supabaseService
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await getAdminFromRequest(req)
    
    const { id, is_read } = await req.json()

    if (!id || is_read === undefined) {
      return NextResponse.json({ error: 'ID and is_read are required' }, { status: 400 })
    }

    const { data, error } = await supabaseService
      .from('contact_messages')
      .update({ is_read })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
