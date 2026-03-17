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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, library_id, plan_months } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !library_id || !plan_months) {
      throw new Error('Missing parameters')
    }

    const planKey = `${plan_months}m`

    // 1. Signature Verification
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!secret) throw new Error('Razorpay secret not configured')

    const expected = await HMAC_SHA256(secret, `${razorpay_order_id}|${razorpay_payment_id}`)
    
    if (expected !== razorpay_signature) {
      throw new Error('Invalid signature')
    }

    // 2. Idempotency check
    const { data: existing } = await supabaseAdmin
      .from('subscription_payments')
      .select('processed')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()
      
    if (existing?.processed) {
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Fetch plan details (price and duration)
    const { data: pricing, error: pError } = await supabaseAdmin
      .from('pricing_config')
      .select('amount, duration_minutes')
      .eq('plan', planKey)
      .single()

    if (pError || !pricing) throw new Error(`Pricing not found for ${planKey}`)
    const durationMinutes = pricing.duration_minutes
    const amount = Number(pricing.amount)

    // 4. Update Library Subscription
    const { data: lib, error: libErr } = await supabaseAdmin
      .from('libraries')
      .select('subscription_end')
      .eq('id', library_id)
      .single()
      
    if (libErr || !lib) throw new Error('Library not found')

    let currentEnd = new Date(lib.subscription_end)
    const today = new Date()
    
    // If already expired, start from today. If not, extend from current end.
    const startBase = currentEnd < today ? today : currentEnd
    const newEnd = new Date(startBase.getTime() + durationMinutes * 60000)
    
    const deleteDate = new Date(newEnd.getTime() + 15 * 24 * 60 * 60000) // 15 days grace

    const { error: updateError } = await supabaseAdmin
      .from('libraries')
      .update({
        subscription_end: newEnd.toISOString(),
        delete_date: deleteDate.toISOString(),
        subscription_status: 'active',
        subscription_plan: planKey
      })
      .eq('id', library_id)

    if (updateError) throw updateError

    // 5. Record Payment
    await supabaseAdmin
      .from('subscription_payments')
      .insert({
        library_id,
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        plan: planKey,
        type: 'renewal',
        processed: true
      })

    return new Response(
      JSON.stringify({ success: true, new_expiry: newEnd.toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Verify renewal error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
