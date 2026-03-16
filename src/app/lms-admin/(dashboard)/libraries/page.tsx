import React from 'react'
import { cookies } from 'next/headers'
import LibrariesTable from '@/components/admin/LibrariesTable'

export default async function LibrariesPage() {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('lms_admin_token')?.value || ''

  let libraries = []
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/admin/libraries`, {
      headers: { Cookie: `lms_admin_token=${adminToken}` },
      cache: 'no-store',
    })
    if (res.ok) libraries = await res.json()
  } catch (e) {
    console.error('Failed to fetch libraries:', e)
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-brand-900 mb-1">Libraries</h1>
          <p className="text-gray-500 font-medium">Manage all registered study libraries</p>
        </div>
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 shadow-sm">
          Total: {libraries.length}
        </div>
      </header>

      <LibrariesTable initialData={libraries} />
    </div>
  )
}
