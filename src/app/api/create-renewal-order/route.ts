import { NextRequest, NextResponse } from 'next/server'
import { verifyCrossSiteToken } from '@/lib/jwt'
import Razorpay from 'razorpay'
import { supabaseService } from '@/lib/supabase/service'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
})

// Hardcoded for now, could be fetched from DB
const PLAN_PRICES: Record<number, number> = {
  1: 500,
  3: 1200,
  6: 2200,
  12: 4000,
}

export async function POST(request: NextRequest) {
  try {
    const { token, library_id, plan_months } = await request.json()

    if (!token || !library_id || !plan_months) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1. Verify token
    const payload = verifyCrossSiteToken(token)
    if (!payload || payload.purpose !== 'renew' || payload.library_id !== library_id) {
      return NextResponse.json({ error: 'Invalid or unauthorized token' }, { status: 401 })
    }

    const amount = PLAN_PRICES[plan_months]
    if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    // 2. Double check ownership just in case (optional since token is signed)
    const { data: staff } = await supabaseService
      .from('staff')
      .select('id')
      .eq('user_id', payload.owner_id)
      .eq('role', 'owner')
      .contains('library_ids', [library_id])
      .single()

    if (!staff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `renewal_${library_id}_${Date.now()}`,
      notes: {
        library_id,
        plan_months: String(plan_months),
        type: 'subscription_renewal',
      },
    })

    // Store in temp_registrations or subscription_payments as pending if needed, 
    // but webhook will handle it entirely based on order_id.

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('create-renewal-order error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
