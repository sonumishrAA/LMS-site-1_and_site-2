import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase.ts'
import { jwtVerify } from 'https://deno.land/x/jose@v4.14.4/index.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    const purpose = url.searchParams.get('purpose')

    if (!token) throw new Error('Token missing')

    const jwtSecret = Deno.env.get('JWT_SECRET')
    if (!jwtSecret) throw new Error('JWT secret not configured')

    const secret = new TextEncoder().encode(jwtSecret)
    
    let payload
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret)
      payload = verifiedPayload
    } catch (err) {
      throw new Error('Invalid or expired token')
    }

    if (purpose && payload.purpose !== purpose) {
      throw new Error('Invalid token purpose')
    }

    // For renewal, fetch library details
    if (payload.purpose === 'renew' && payload.library_id) {
      const { data: library } = await supabaseAdmin
        .from('libraries')
        .select('name, subscription_status, subscription_end')
        .eq('id', payload.library_id)
        .single()

      if (!library) throw new Error('Library not found')

      return new Response(
        JSON.stringify({
          valid: true,
          payload,
          library
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        valid: true,
        payload
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Verify-token error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
