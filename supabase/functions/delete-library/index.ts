import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase.ts'
import { jwtVerify } from 'https://deno.land/x/jose@v4.14.4/index.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify Admin Token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')
    
    const token = authHeader.replace('Bearer ', '')
    const jwtSecret = Deno.env.get('JWT_SECRET')
    if (!jwtSecret) throw new Error('JWT secret not configured')
    
    const secret = new TextEncoder().encode(jwtSecret)
    const { payload } = await jwtVerify(token, secret)
    if (payload.role !== 'superadmin') throw new Error('Unauthorized')

    const { id: libId } = await req.json()
    if (!libId) throw new Error('Library ID is required')

    // 2. Get owner_id and staff details before deleting
    const { data: lib } = await supabaseAdmin
      .from('libraries')
      .select('owner_id')
      .eq('id', libId)
      .single()

    const { data: staffRows } = await supabaseAdmin
      .from('staff')
      .select('user_id, library_ids')
      .contains('library_ids', [libId])

    // 3. Delete library
    const { error: libError } = await supabaseAdmin
      .from('libraries')
      .delete()
      .eq('id', libId)

    if (libError) throw libError

    // 4. Handle staff cleanup
    if (staffRows && staffRows.length > 0) {
      for (const s of staffRows) {
        if (!s.user_id) continue
        const otherLibs = (s.library_ids || []).filter((id: string) => id !== libId)
        if (otherLibs.length > 0) {
          await supabaseAdmin.from('staff').update({ library_ids: otherLibs }).eq('user_id', s.user_id)
        } else {
          await supabaseAdmin.auth.admin.deleteUser(s.user_id)
        }
      }
    }

    // 5. Delete owner auth user if they have no other libraries
    if (lib?.owner_id) {
      const { data: otherLibs } = await supabaseAdmin
        .from('libraries')
        .select('id')
        .eq('owner_id', lib.owner_id)

      if (!otherLibs || otherLibs.length === 0) {
        await supabaseAdmin.auth.admin.deleteUser(lib.owner_id)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Delete library error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
