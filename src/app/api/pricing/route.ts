import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export async function GET() {
  try {
    const { data, error } = await supabaseService
      .from('pricing_config')
      .select('*')
      .order('plan', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Pricing fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 })
  }
}
