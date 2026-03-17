import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase.ts'

const HMAC_SHA256 = async (key: string, data: string) => {
  const encoder = new TextEncoder()
  const keyBuffer = encoder.encode(key)
  const dataBuffer = encoder.encode(data)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer)
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      return new Response(JSON.stringify({ error: 'Missing signature or secret' }), { status: 400 })
    }

    const expectedSignature = await HMAC_SHA256(webhookSecret, rawBody)

    if (expectedSignature !== signature) {
      console.error('Webhook signature mismatch')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    console.log('Razorpay Webhook Event:', event)

    if (event === 'order.paid' || event === 'payment.captured') {
      const orderId = event === 'order.paid' 
        ? payload.payload.order.entity.id 
        : payload.payload.payment.entity.order_id
        
      const paymentId = payload.payload.payment.entity.id
      
      if (!orderId) {
        return new Response(JSON.stringify({ success: true, message: 'No order_id found' }), { status: 200 })
      }

      const { data: existing } = await supabaseAdmin
        .from('subscription_payments')
        .select('processed')
        .eq('razorpay_order_id', orderId)
        .single()

      if (existing?.processed) {
        return new Response(JSON.stringify({ success: true, message: 'Already processed' }), { status: 200 })
      }

      const notes = payload.payload.payment.entity.notes || {}
      
      // BRANCH 1: SUBSCRIPTION RENEWAL
      if (notes.type === 'subscription_renewal') {
        const libraryId = notes.library_id
        const planKey = notes.plan || `${notes.plan_months}m`

        if (!libraryId || !planKey) {
          throw new Error('Missing notes data in renewal')
        }

        // Fetch plan details
        const { data: pricing, error: pError } = await supabaseAdmin
          .from('pricing_config')
          .select('amount, duration_minutes')
          .eq('plan', planKey)
          .single()

        if (pError || !pricing) throw new Error(`Pricing not found for ${planKey}`)
        const durationMinutes = pricing.duration_minutes
        const amount = Number(pricing.amount)

        const today = new Date()
        const subscriptionStart = today.toISOString()
        
        const newEnd = new Date(today.getTime() + durationMinutes * 60000)
        const subscriptionEndStr = newEnd.toISOString()

        const deleteDate = new Date(newEnd.getTime() + 15 * 24 * 60 * 60000) // 15 days grace
        const deleteDateStr = deleteDate.toISOString()

        // Update Library
        await supabaseAdmin
          .from('libraries')
          .update({
            subscription_start: subscriptionStart,
            subscription_end: subscriptionEndStr,
            delete_date: deleteDateStr,
            subscription_status: 'active',
            subscription_plan: planKey,
            data_cleared: false,
            notif_sent_7d: false,
            notif_sent_3d: false,
            notif_sent_1d: false,
            cleanup_warn_sent: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', libraryId)

        // Record Payment
        await supabaseAdmin.from('subscription_payments').insert({
          library_id: libraryId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          amount,
          processed: true,
          type: 'renewal',
          plan: planKey
        })

        // Notify
        await supabaseAdmin.from('notifications').insert({
          library_id: libraryId,
          type: 'subscription_expiry',
          title: 'Subscription Renewed',
          message: `Subscription renewed for plan ${planKey}. Active until ${newEnd.toLocaleString()}.`,
          is_read: false,
        })

        return new Response(JSON.stringify({ success: true, message: 'Renewal processed' }), { status: 200 })
      }

      // BRANCH 2: NEW REGISTRATION
      const { data: tempReg } = await supabaseAdmin
        .from('temp_registrations')
        .select('form_data')
        .eq('razorpay_order_id', orderId)
        .single()

      if (!tempReg) {
        throw new Error(`Registration data not found for order: ${orderId}`)
      }

      const f = tempReg.form_data
      let ownerIdStr = 'webhook_owner_placeholder'
      
      // Resolve/Create Auth User
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = authUsers?.users.find(u => u.email === f.owner.email)
      
      if (f.owner.isExisting && existingUser) {
        ownerIdStr = existingUser.id
      } else if (!f.owner.isExisting) {
        if (existingUser) {
          ownerIdStr = existingUser.id
        } else {
          const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
            email: f.owner.email,
            password: f.owner.password,
            email_confirm: true,
            user_metadata: { name: f.owner.name }
          })
          if (newUser.user) ownerIdStr = newUser.user.id
        }
      }

      // Resolve Staff
      if (f.staff_list && f.staff_list.length > 0) {
        for (const staff of f.staff_list) {
          const existingStaff = authUsers?.users.find(u => u.email === staff.email)
          if (existingStaff) {
            staff.user_id = existingStaff.id
          } else {
            const { data: newStaff } = await supabaseAdmin.auth.admin.createUser({
              email: staff.email,
              password: staff.password,
              email_confirm: true,
              user_metadata: { name: staff.name }
            })
            if (newStaff.user) staff.user_id = newStaff.user.id
          }
        }
      }

      // Finalize via RPC
      const { error: rpcError } = await supabaseAdmin.rpc(
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

      if (rpcError) throw rpcError
    }

    if (event === 'payment.failed') {
      const orderId = payload.payload.payment.entity.order_id
      await supabaseAdmin
        .from('subscription_payments')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', orderId)
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })

  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})
