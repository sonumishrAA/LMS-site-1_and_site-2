import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseService } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Webhook signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    console.log('Razorpay Webhook Event:', event)

    // 1. HANDLE SUCCESSFUL PAYMENT (Support both order.paid and payment.captured)
    if (event === 'order.paid' || event === 'payment.captured') {
      const orderId = event === 'order.paid' 
        ? payload.payload.order.entity.id 
        : payload.payload.payment.entity.order_id
        
      const paymentId = payload.payload.payment.entity.id
      
      if (!orderId) {
        return NextResponse.json({ success: true, message: 'No order_id found, skipping' })
      }

      const { data: existing } = await supabaseService
        .from('subscription_payments')
        .select('processed')
        .eq('razorpay_order_id', orderId)
        .single()

      if (existing?.processed) {
        return NextResponse.json({ success: true, message: 'Already processed' })
      }

      const notes = payload.payload.payment.entity.notes || {}
      
      // BRANCH 1: SUBSCRIPTION RENEWAL
      if (notes.type === 'subscription_renewal') {
        const libraryId = notes.library_id
        const planMonths = Number(notes.plan_months)

        if (!libraryId || !planMonths) {
          console.error('Missing library_id or plan_months in renewal webhook')
          return NextResponse.json({ error: 'Missing notes data' }, { status: 400 })
        }

        const today = new Date()
        const subscriptionStart = today.toISOString().split('T')[0]
        
        const subscriptionEnd = new Date(today)
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + planMonths)
        const subscriptionEndStr = subscriptionEnd.toISOString().split('T')[0]

        const deleteDate = new Date(subscriptionEnd)
        deleteDate.setDate(deleteDate.getDate() + 15)
        const deleteDateStr = deleteDate.toISOString().split('T')[0]

        // Update Library
        await supabaseService
          .from('libraries')
          .update({
            subscription_start: subscriptionStart,
            subscription_end: subscriptionEndStr,
            delete_date: deleteDateStr,
            subscription_status: 'active',
            subscription_plan: `${planMonths}m`,
            data_cleared: false,
            notif_sent_7d: false,
            notif_sent_3d: false,
            notif_sent_1d: false,
            cleanup_warn_sent: false,
          })
          .eq('id', libraryId)

        // Record Payment
        await supabaseService.from('subscription_payments').insert({
          library_id: libraryId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          amount: (payload.payload.payment.entity.amount || 0) / 100,
          plan_months: planMonths,
          plan_key: `${planMonths}m`,
          processed: true,
        })

        // Notify
        await supabaseService.from('notifications').insert({
          library_id: libraryId,
          type: 'subscription_renewed',
          message: `Subscription renewed for ${planMonths} month${planMonths > 1 ? 's' : ''}. Active until ${subscriptionEndStr}.`,
          is_read: false,
        })

        return NextResponse.json({ success: true, message: 'Renewal processed successfully' })
      }

      // BRANCH 2: NEW REGISTRATION OR ADD LIBRARY
      const { data: tempReg } = await supabaseService
        .from('temp_registrations')
        .select('form_data')
        .eq('razorpay_order_id', orderId)
        .single()

      if (!tempReg) {
        console.error(`Registration data not found for order: ${orderId}`)
        return NextResponse.json({ error: 'Registration data not found' }, { status: 400 })
      }

      const f = tempReg.form_data

      // Resolve Auth User ID before calling RPC
      let ownerIdStr = 'webhook_owner_placeholder'
      
      try {
        const { data: authUsers, error: listError } = await supabaseService.auth.admin.listUsers()
        if (listError) throw listError
        
        const existingUser = authUsers.users.find(u => u.email === f.owner.email)
        
        if (f.owner.isExisting && existingUser) {
          ownerIdStr = existingUser.id
        } else if (!f.owner.isExisting) {
          if (existingUser) {
            ownerIdStr = existingUser.id // Fallback if they forgot to click existing
          } else {
            const { data: newUser, error: createError } = await supabaseService.auth.admin.createUser({
              email: f.owner.email,
              password: f.owner.password,
              email_confirm: true,
              user_metadata: { name: f.owner.name }
            })
            if (createError) throw createError
            if (newUser.user) ownerIdStr = newUser.user.id
          }
        }

        // Also resolve Auth User IDs for optional staff
        if (f.staff_list && f.staff_list.length > 0) {
          for (const staff of f.staff_list) {
            const existingStaff = authUsers.users.find(u => u.email === staff.email)
            if (existingStaff) {
              staff.user_id = existingStaff.id
            } else {
              const { data: newStaff, error: createStaffErr } = await supabaseService.auth.admin.createUser({
                email: staff.email,
                password: staff.password,
                email_confirm: true,
                user_metadata: { name: staff.name }
              })
              if (createStaffErr) throw createStaffErr
              if (newStaff.user) staff.user_id = newStaff.user.id
            }
          }
        }
      } catch (authError) {
        console.error('Webhook Auth Resolution Error:', authError)
        return NextResponse.json({ error: 'Auth user resolution failed' }, { status: 500 })
      }

      const { error: rpcError } = await supabaseService.rpc(
        'complete_library_registration',
        {
          p_order_id:      orderId,
          p_owner_uid:     ownerIdStr, 
          p_library_data:  f.library,
          p_seat_config:   f.seats,
          p_locker_config: f.lockers,
          p_shifts:        f.shifts,
          p_combo_plans:   f.combos,
          p_locker_policy: f.locker_policy,
          p_owner_data:    f.owner,
          p_staff_list:    f.staff_list || [],
          p_plan:          f.plan || '1m',
          p_amount:        f.amount || 0,
          p_razorpay_pid:  paymentId,
          p_razorpay_sig:  'via_webhook',
        }
      )

      if (rpcError) {
        console.error('Webhook RPC Error:', rpcError)
        return NextResponse.json({ error: 'Database processing failed' }, { status: 500 })
      }
    }

    // 2. HANDLE FAILED PAYMENT
    if (event === 'payment.failed') {
      const orderId = payload.payload.payment.entity.order_id
      const errorDesc = payload.payload.payment.entity.error_description

      console.warn(`Payment failed for order ${orderId}: ${errorDesc}`)

      await supabaseService
        .from('subscription_payments')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', orderId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
