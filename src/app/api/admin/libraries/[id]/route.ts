import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { getAdminFromRequest } from '@/lib/admin-auth'

// PATCH /api/admin/libraries/[id] — update subscription info
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getAdminFromRequest(req)
    const { id } = await params
    const body = await req.json()

    const allowed = [
      'subscription_status',
      'subscription_plan',
      'subscription_start',
      'subscription_end',
      'name',
      'phone',
      'address',
      'delete_date',
    ]
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }
    updates.updated_at = new Date().toISOString()

    const { error } = await supabaseService
      .from('libraries')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE /api/admin/libraries/[id] — delete library + cleanup auth users
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getAdminFromRequest(req)
    const { id: libId } = await params

    // 1. Get owner_id and staff details before deleting
    const { data: lib } = await supabaseService
      .from('libraries')
      .select('owner_id')
      .eq('id', libId)
      .single()

    const { data: staffRows } = await supabaseService
      .from('staff')
      .select('user_id, library_ids')
      .contains('library_ids', [libId])

    // 2. Delete library (cascades to students, seats, shifts, etc via DB constraints)
    // NOTE: This will fail if payment_records or subscription_payments exist without ON DELETE CASCADE
    const { error: libError } = await supabaseService
      .from('libraries')
      .delete()
      .eq('id', libId)

    if (libError) {
      console.error('Database delete error:', libError)
      return NextResponse.json({ error: `Database error: ${libError.message}` }, { status: 500 })
    }

    // 3. Handle staff cleanup
    if (staffRows && staffRows.length > 0) {
      for (const s of staffRows) {
        if (!s.user_id) continue

        const otherLibs = (s.library_ids || []).filter((id: string) => id !== libId)

        if (otherLibs.length > 0) {
          // Staff belongs to other libraries, just remove this library ID from their list
          await supabaseService
            .from('staff')
            .update({ library_ids: otherLibs })
            .eq('user_id', s.user_id)
        } else {
          // Staff only belonged to this library, delete auth user
          // The staff record itself will be deleted if ON DELETE CASCADE is set on staff.user_id
          await supabaseService.auth.admin.deleteUser(s.user_id)
        }
      }
    }

    // 4. Delete owner auth user if they have no other libraries
    if (lib?.owner_id) {
      const { data: otherLibs } = await supabaseService
        .from('libraries')
        .select('id')
        .eq('owner_id', lib.owner_id)

      if (!otherLibs || otherLibs.length === 0) {
        await supabaseService.auth.admin.deleteUser(lib.owner_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete library error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete library' }, { status: 500 })
  }
}
