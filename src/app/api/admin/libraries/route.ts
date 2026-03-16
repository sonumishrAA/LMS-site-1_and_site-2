import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { getAdminFromRequest } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    await getAdminFromRequest(req)

    // 1. Fetch all libraries
    const { data: libraries, error } = await supabaseService
      .from('libraries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // 2. Fetch all staff
    const { data: allStaff } = await supabaseService
      .from('staff')
      .select('*')
      .order('created_at', { ascending: true })

    // 3. Fetch student counts grouped by library
    const { data: allStudents } = await supabaseService
      .from('students')
      .select('library_id, gender, id, is_deleted')

    // 4. Fetch all Supabase Auth users (service role)
    const { data: authData } = await supabaseService.auth.admin.listUsers({ perPage: 1000 })
    const authUsers = authData?.users || []

    // Build email → metadata map
    const authMap: Record<string, { name?: string; email?: string; user_id?: string }> = {}
    for (const u of authUsers) {
      authMap[u.id] = {
        name: u.user_metadata?.name || u.email?.split('@')[0],
        email: u.email,
        user_id: u.id,
      }
    }

    // 5. Enrich libraries
    const enriched = (libraries || []).map((lib) => {
      // Staff for this library
      const staff = (allStaff || [])
        .filter((s) => (s.library_ids || []).includes(lib.id))
        .map((s) => ({
          ...s,
          auth_email: authMap[s.user_id]?.email || s.email,
          auth_name: authMap[s.user_id]?.name || s.name,
        }))

      // Owner auth info
      const ownerAuth = lib.owner_id ? authMap[lib.owner_id] : null

      // Students for this library
      const libStudents = (allStudents || []).filter(
        (st) => st.library_id === lib.id && !st.is_deleted
      )
      const studentStats = {
        total: libStudents.length,
        male: libStudents.filter((s) => s.gender === 'male').length,
        female: libStudents.filter((s) => s.gender === 'female').length,
        neutral: libStudents.filter((s) => s.gender === 'neutral').length,
      }

      return {
        ...lib,
        staff,
        owner_email: ownerAuth?.email || null,
        owner_name: ownerAuth?.name || null,
        student_stats: studentStats,
      }
    })

    return NextResponse.json(enriched)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
