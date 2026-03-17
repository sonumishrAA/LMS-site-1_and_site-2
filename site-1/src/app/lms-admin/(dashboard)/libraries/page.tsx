'use client'

import React, { useEffect, useState } from 'react'
import { callEdgeFunction } from '@/lib/api'
import LibrariesTable from '@/components/admin/LibrariesTable'
import { Loader2 } from 'lucide-react'

export default function LibrariesPage() {
  const [enriched, setEnriched] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await callEdgeFunction('admin-libraries', {
          method: 'POST',
          useAdminToken: true
        })
        setEnriched(data)
      } catch (err) {
        console.error('Failed to fetch libraries:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-gray-500 font-medium">Loading Libraries...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-brand-900 mb-1">Libraries</h1>
          <p className="text-gray-500 font-medium">Manage all registered study libraries</p>
        </div>
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 shadow-sm">
          Total: {enriched.length}
        </div>
      </header>

      <LibrariesTable initialData={enriched} />
    </div>
  )
}
