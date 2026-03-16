'use client'

import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Save, 
  Trash2, 
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { format } from 'date-fns'

interface PricingPlan {
  id: number
  plan: string
  amount: number
  updated_at?: string
}

export default function PricingControl() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isCleaning, setIsCleaning] = useState(false)

  const fetchPlans = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/pricing')
      const data = await res.json()
      if (res.ok) setPlans(data)
    } catch (err) {
      console.error('Failed to fetch pricing:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handlePriceChange = (plan: string, value: string) => {
    setPlans(prev => prev.map(p => p.plan === plan ? { ...p, amount: parseInt(value) || 0 } : p))
  }

  const savePrice = async (plan: string, amount: number) => {
    setIsSaving(plan)
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, amount })
      })
      
      if (res.ok) {
        setNotification({ type: 'success', message: `${plan.toUpperCase()} plan updated successfully` })
        fetchPlans()
      } else {
        throw new Error('Update failed')
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update pricing' })
    } finally {
      setIsSaving(null)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleDataCleanup = async () => {
    if (!confirm('This will permanently delete all student data for libraries past their delete_date. Cannot be undone. Are you sure?')) return
    
    setIsCleaning(true)
    try {
      // Assuming a cron/cleanup endpoint exists
      const res = await fetch('/api/cron/data-cleanup', {
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}` }
      })
      const result = await res.json()
      alert(`${result.librariesCleaned} libraries cleaned. ${result.studentsDeleted} students deleted.`)
    } catch (err) {
      alert('Cleanup failed. Check server logs.')
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <div className="space-y-10 max-w-4xl">
      <header>
        <h1 className="text-3xl font-serif text-brand-900 mb-1">Pricing Control</h1>
        <p className="text-gray-500 font-medium">Changes apply immediately to all new registrations and renewals.</p>
      </header>

      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <p className="text-sm font-bold">{notification.message}</p>
        </div>
      )}

      <div className="bg-amber-50 border-l-[4px] border-amber-600 p-6 rounded-r-2xl">
        <div className="flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <span className="font-bold">Important Notice:</span> Price changes do <span className="font-bold">NOT</span> affect existing active subscriptions. Only new registrations and renewals will use the new price points.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Plan</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Current Price</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">New Price (₹)</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Last Changed</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-6 h-16 bg-gray-50/20"></td>
                </tr>
              ))
            ) : (
              plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-brand-900 uppercase tracking-tight">{plan.plan === '1m' ? '1 Month' : plan.plan === '3m' ? '3 Months' : plan.plan === '6m' ? '6 Months' : '12 Months'}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-mono font-bold text-gray-600">₹{plan.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <input 
                      type="number"
                      min="0"
                      step="50"
                      value={plan.amount}
                      onChange={(e) => handlePriceChange(plan.plan, e.target.value)}
                      className="w-28 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {plan.updated_at ? format(new Date(plan.updated_at), 'd MMM yyyy') : 'Never changed'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => savePrice(plan.plan, plan.amount)}
                      disabled={isSaving !== null}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-900 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {isSaving === plan.plan ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-6">Danger Zone</h3>
        <div className="bg-red-50/50 border border-red-100 p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-red-900 font-bold">Delete Expired Student Data</h4>
            <p className="text-sm text-red-700/70 font-medium">This runs automatically at 2AM daily. Manual trigger for testing or urgent cleanup only.</p>
          </div>
          <button 
            onClick={handleDataCleanup}
            disabled={isCleaning}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {isCleaning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear Expired Data Now
          </button>
        </div>
      </div>
    </div>
  )
}
