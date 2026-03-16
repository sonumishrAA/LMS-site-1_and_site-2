import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // 1. HMAC verify
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')
      
    if (expected !== razorpay_signature) {
      console.error('Signature mismatch:', { expected, razorpay_signature })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 2. Idempotency check
    const { data: existing } = await supabaseService
      .from('subscription_payments')
      .select('processed, library_id')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()
      
    if (existing?.processed) {
      return NextResponse.json({ success: true, library_id: existing.library_id })
    }

    // 3. Fetch form_data from temp_registrations
    const { data: tempReg, error: tempError } = await supabaseService
      .from('temp_registrations')
      .select('form_data')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()
      
    if (tempError || !tempReg) {
      console.error('Registration data expired or not found for order:', razorpay_order_id)
      return NextResponse.json({ error: 'Registration data expired' }, { status: 400 })
    }

    const f = tempReg.form_data

    // 4. Create real auth user for owner
    const { data: userData, error: userError } = await supabaseService.auth.admin.createUser({
      email: f.owner.email,
      password: f.owner.password,
      email_confirm: true,
      user_metadata: { name: f.owner.name, role: 'owner' }
    })

    if (userError) {
      console.error('User creation error:', userError)
      // If user already exists, we might need to handle it differently
      // but for registration flow, we assume it's a new email or handled by frontend
      if (userError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
      }
      throw userError
    }

    const owner_uid = userData.user.id

    // 5. Create users for staff if any
    const staff_list_processed = []
    if (f.staff_list && f.staff_list.length > 0) {
      for (const staff of f.staff_list) {
        const { data: sData, error: sError } = await supabaseService.auth.admin.createUser({
          email: staff.email,
          password: staff.password,
          email_confirm: true,
          user_metadata: { name: staff.name, role: 'staff' }
        })
        if (!sError) {
          staff_list_processed.push({
            user_id: sData.user.id,
            name: staff.name,
            email: staff.email,
            staff_type: staff.staff_type
          })
        }
      }
    }

    // 6. Call atomic Postgres function
    const { data: result, error: rpcError } = await supabaseService.rpc(
      'complete_library_registration',
      {
        p_order_id:      razorpay_order_id,
        p_owner_uid:     owner_uid,
        p_library_data:  f.library,
        p_seat_config:   f.seats,
        p_locker_config: f.lockers,
        p_shifts:        f.shifts,
        p_combo_plans:   f.combos,
        p_locker_policy: f.locker_policy,
        p_owner_data:    f.owner,
        p_staff_list:    staff_list_processed,
        p_plan:          f.plan || '1m',
        p_amount:        f.amount || 0,
        p_razorpay_pid:  razorpay_payment_id,
        p_razorpay_sig:  razorpay_signature,
      }
    )

    if (rpcError) {
      console.error('RPC Error:', rpcError)
      return NextResponse.json({ error: 'Database setup failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, library_id: result.library_id })
  } catch (err) {
    console.error('Verification error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
