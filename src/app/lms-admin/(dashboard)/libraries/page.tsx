import React from 'react'
import { supabaseService } from '@/lib/supabase/service'
import LibrariesTable from '@/components/admin/LibrariesTable'

export default async function LibrariesPage() {
  const { data: libraries } = await supabaseService
    .from('libraries')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-brand-900 mb-1">Libraries</h1>
          <p className="text-gray-500 font-medium">Manage all registered study libraries</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
          Export CSV
        </button>
      </header>

      <LibrariesTable initialData={libraries || []} />
    </div>
  )
}
