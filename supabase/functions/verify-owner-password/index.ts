import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin, createSupabaseClient } from '../_shared/supabase.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password } = await req.json()
    if (!email || !password) throw new Error('Email and password required')

    // 1. Verify credentials using standard client
    const supabase = createSupabaseClient(req)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !signInData.user) {
      return new Response(JSON.stringify({ verified: false, error: 'Invalid credentials' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 2. Fetch owner staff profile
    const { data: staff } = await supabaseAdmin
      .from('staff')
      .select('id, name, library_ids')
      .eq('user_id', signInData.user.id)
      .single()

    let libraries: any[] = []
    if (staff?.library_ids?.length) {
      const { data: libs } = await supabaseAdmin
        .from('libraries')
        .select('name, city')
        .in('id', staff.library_ids)
      
      libraries = libs || []
    }

    return new Response(JSON.stringify({ 
      verified: true, 
      owner_id: signInData.user.id,
      owner_name: staff?.name,
      libraries 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('Verify owner password error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
