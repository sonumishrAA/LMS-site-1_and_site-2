import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import Razorpay from 'razorpay'

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const body = await req.json()
    const { form_data, plan } = body

    // 1. Fetch pricing from DB
    const { data: pricing, error: pricingError } = await supabaseService
      .from('pricing_config')
      .select('amount')
      .eq('plan', plan)
      .single()

    if (pricingError || !pricing) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // 2. Create Razorpay order
    const type = form_data?.owner?.isExisting ? 'add_library' : 'registration'
    
    const order = await razorpay.orders.create({
      amount: Math.round(pricing.amount * 100), // paise
      currency: 'INR',
      receipt: `reg_${Date.now()}`,
      notes: {
        type,
      }
    })

    // 3. Store form_data in temp_registrations (GAP 1 FIX)
    const { error: tempError } = await supabaseService.from('temp_registrations').insert({
      razorpay_order_id: order.id,
      form_data: form_data,
    })

    if (tempError) {
      console.error('Temp reg error:', tempError)
      return NextResponse.json({ error: 'Failed to store registration' }, { status: 500 })
    }

    // 4. Insert pending subscription_payment row
    await supabaseService.from('subscription_payments').insert({
      razorpay_order_id: order.id,
      amount: pricing.amount,
      plan: plan,
      status: 'pending',
      processed: false,
      type: type,
    })

    return NextResponse.json({ order_id: order.id, amount: pricing.amount })
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
