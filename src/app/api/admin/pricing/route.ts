import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { getAdminFromRequest } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    await getAdminFromRequest(req)
    
    const { data, error } = await supabaseService
      .from('pricing_config')
      .select('*')
      .order('plan', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await getAdminFromRequest(req)
    
    const { plan, amount } = await req.json()

    if (!plan || amount === undefined) {
      return NextResponse.json({ error: 'Plan and amount are required' }, { status: 400 })
    }

    const { data, error } = await supabaseService
      .from('pricing_config')
      .update({ 
        amount,
        updated_at: new Date().toISOString()
      })
      .eq('plan', plan)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
